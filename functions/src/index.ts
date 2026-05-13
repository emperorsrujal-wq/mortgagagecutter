
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";

// Initialize the Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

const SENDER_PHONE_NUMBER = "+13158777123"; // <-- IMPORTANT: Replace with your service's sending number
const SMS_API_ENDPOINT = "https://gateway.voidfix.com/services/send.php"; // <-- Updated API Endpoint

/**
 * Triggered when a new lead is created in Firestore.
 * Sends a welcome SMS using a third-party API.
 */
export const sendWelcomeSms = functions.firestore
  .document("/leads/{leadId}")
  .onCreate(async (snapshot, context) => {
    const leadData = snapshot.data();
    const phoneNumber = leadData?.phone;

    // Exit if there's no phone number
    if (!phoneNumber) {
      functions.logger.log(`No phone number for lead ${context.params.leadId}, skipping SMS.`);
      return null;
    }

    // --- Securely get the API Key ---
    const apiKey = functions.config().sms.api_key;
    if (!apiKey) {
        functions.logger.error("FATAL: SMS API key is not configured. Set it with `firebase functions:config:set sms.api_key=...`");
        return null;
    }

    // --- Define the welcome message ---
    const welcomeMessage = "Welcome to Mortgage Cutter! We're excited to help you on your path to financial freedom. A specialist will review your details soon.";

    // --- Prepare the request for the external API ---
    const requestBody = {
      to: phoneNumber,
      from: SENDER_PHONE_NUMBER,
      body: welcomeMessage,
    };

    functions.logger.log(`Sending SMS to ${phoneNumber}...`);

    try {
      const response = await fetch(SMS_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        functions.logger.error(
          `Failed to send SMS. Status: ${response.status}. Body: ${errorText}`
        );
        return null;
      }

      functions.logger.log("Successfully sent welcome SMS.", { sid: (await response.json() as any)?.sid });
      return { success: true };

    } catch (error) {
      functions.logger.error("An unexpected error occurred while sending SMS:", error);
      return null;
    }
  });

/**
 * Triggered when a new purchase is recorded for a lead.
 * Sends a purchase confirmation email via the mail collection.
 */
export const sendPurchaseConfirmationEmail = functions.firestore
  .document("/leads/{leadId}/purchases/{purchaseId}")
  .onCreate(async (snapshot, context) => {
    const purchaseData = snapshot.data();
    const leadId = context.params.leadId;

    try {
      // Fetch the lead document to get the user's email and name
      const leadDoc = await db.collection("leads").doc(leadId).get();
      if (!leadDoc.exists) {
        functions.logger.warn(`Lead ${leadId} not found for purchase confirmation.`);
        return null;
      }

      const lead = leadDoc.data();
      const userEmail = lead?.email;
      const userName = lead?.name || "Valued Customer";

      if (!userEmail) {
        functions.logger.warn(`No email found for lead ${leadId}, skipping purchase confirmation.`);
        return null;
      }

      const productName = purchaseData?.productName || "Your Purchase";
      const amount = purchaseData?.amount || "";
      const accessUrl = purchaseData?.accessUrl || `https://mortgagecutter.com/members`;

      // Queue the email in the mail collection for the Trigger Email extension
      await db.collection("mail").add({
        to: userEmail,
        template: {
          name: "purchase_confirmation",
          data: {
            name: userName,
            productName,
            amount,
            accessUrl,
          },
        },
      });

      functions.logger.log(`Purchase confirmation email queued for ${userEmail}`, {
        leadId,
        purchaseId: context.params.purchaseId,
        productName,
      });

      return { success: true };
    } catch (error) {
      functions.logger.error("Error sending purchase confirmation email:", error);
      return null;
    }
  });

/**
 * Scheduled function that runs every day at 9:00 AM.
 * Finds leads who registered but haven't completed the questionnaire
 * after 24 hours, and sends a reminder email.
 */
export const sendAbandonedQuestionnaireReminders = functions.pubsub
  .schedule("0 9 * * *")
  .timeZone("America/New_York")
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const twentyFourHoursAgo = new admin.firestore.Timestamp(
      now.seconds - 24 * 60 * 60,
      now.nanoseconds
    );
    const fortyEightHoursAgo = new admin.firestore.Timestamp(
      now.seconds - 48 * 60 * 60,
      now.nanoseconds
    );

    try {
      // Find leads who:
      // 1. Have status 'registered' (not 'completed_questionnaire')
      // 2. Registered between 24 and 48 hours ago (so we don't spam recent signups or very old ones)
      // 3. Have an email address
      const leadsSnapshot = await db
        .collection("leads")
        .where("status", "==", "registered")
        .where("submissionDate", ">=", fortyEightHoursAgo)
        .where("submissionDate", "<=", twentyFourHoursAgo)
        .get();

      if (leadsSnapshot.empty) {
        functions.logger.log("No abandoned questionnaires found for reminder.");
        return null;
      }

      const batch = db.batch();
      let reminderCount = 0;

      for (const leadDoc of leadsSnapshot.docs) {
        const lead = leadDoc.data();
        const userEmail = lead?.email;
        const userName = lead?.name || "Friend";

        if (!userEmail) continue;

        // Check if we already sent a reminder to this user
        const reminderSent = lead?.abandonedQuestionnaireReminderSent;
        if (reminderSent) continue;

        const mailRef = db.collection("mail").doc();
        batch.set(mailRef, {
          to: userEmail,
          template: {
            name: "abandoned_questionnaire",
            data: {
              name: userName,
              questionnaireUrl: "https://mortgagecutter.com/questionnaire",
            },
          },
        });

        // Mark reminder as sent so we don't send duplicates
        batch.update(leadDoc.ref, {
          abandonedQuestionnaireReminderSent: true,
          abandonedQuestionnaireReminderSentAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        reminderCount++;
      }

      await batch.commit();
      functions.logger.log(`Sent ${reminderCount} abandoned questionnaire reminders.`);
      return { remindersSent: reminderCount };

    } catch (error) {
      functions.logger.error("Error sending abandoned questionnaire reminders:", error);
      return null;
    }
  });

/**
 * Triggered when a new lead is created.
 * Automatically enrolls the user in the 5-Day Mortgage Freedom Challenge.
 */
export const enrollChallenge = functions.firestore
  .document("/leads/{leadId}")
  .onCreate(async (snapshot, context) => {
    const leadData = snapshot.data();
    const email = leadData?.email;

    if (!email) {
      functions.logger.log(`No email for lead ${context.params.leadId}, skipping challenge enrollment.`);
      return null;
    }

    try {
      await snapshot.ref.update({
        challengeEnrolledAt: admin.firestore.FieldValue.serverTimestamp(),
        challengeDay: 0,
        challengeEmailsSent: [],
      });
      functions.logger.log(`Enrolled lead ${context.params.leadId} in challenge.`, { email });
      return { success: true };
    } catch (error) {
      functions.logger.error("Error enrolling lead in challenge:", error);
      return null;
    }
  });

/**
 * Scheduled function that runs every day at 8:00 AM ET.
 * Sends the appropriate challenge email to each enrolled user based on their day.
 */
export const sendChallengeEmails = functions.pubsub
  .schedule("0 8 * * *")
  .timeZone("America/New_York")
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();

    // Templates map: day number -> template name
    const dayTemplates: Record<number, string> = {
      1: "challenge_day1",
      2: "challenge_day2",
      3: "challenge_day3",
      4: "challenge_day4",
      5: "challenge_day5",
    };

    // URL templates
    const getTemplateData = (day: number, name: string, email: string) => {
      const baseUrl = "https://mortgagecutter.com";
      switch (day) {
        case 1:
          return { name, lesson1Url: `${baseUrl}/learn/lesson/1` };
        case 2:
          return { name, calculatorUrl: `${baseUrl}/questionnaire` };
        case 3:
          return { name, lesson2Url: `${baseUrl}/learn/lesson/2` };
        case 4:
          return { name };
        case 5:
          return { name, salesUrl: `${baseUrl}/purchase?plan=elite_997` };
        default:
          return { name };
      }
    };

    try {
      // Find all leads enrolled in the challenge who haven't completed it
      const leadsSnapshot = await db
        .collection("leads")
        .where("challengeEnrolledAt", ">", new admin.firestore.Timestamp(0, 0))
        .where("challengeDay", "<", 5)
        .get();

      if (leadsSnapshot.empty) {
        functions.logger.log("No active challenge enrollments found.");
        return null;
      }

      let emailsQueued = 0;
      const batch = db.batch();

      for (const leadDoc of leadsSnapshot.docs) {
        const lead = leadDoc.data();
        const enrolledAt = lead.challengeEnrolledAt as admin.firestore.Timestamp;
        const emailsSent = lead.challengeEmailsSent || [];
        const name = lead.name || "Friend";
        const email = lead.email;

        if (!enrolledAt || !email) continue;

        // Calculate which day the user should be on (1-5)
        const hoursSinceEnrollment = (now.seconds - enrolledAt.seconds) / 3600;
        const currentDay = Math.min(5, Math.max(1, Math.floor(hoursSinceEnrollment / 24) + 1));

        // Only send if they haven't received this day's email yet
        const templateName = dayTemplates[currentDay];
        if (!templateName || emailsSent.includes(templateName)) continue;

        // Queue the email
        const mailRef = db.collection("mail").doc();
        batch.set(mailRef, {
          to: email,
          template: {
            name: templateName,
            data: getTemplateData(currentDay, name, email),
          },
        });

        // Update lead progress
        batch.update(leadDoc.ref, {
          challengeDay: currentDay,
          challengeEmailsSent: admin.firestore.FieldValue.arrayUnion(templateName),
          [`challengeDay${currentDay}SentAt`]: admin.firestore.FieldValue.serverTimestamp(),
        });

        emailsQueued++;
      }

      await batch.commit();
      functions.logger.log(`Queued ${emailsQueued} challenge emails.`);
      return { emailsQueued };

    } catch (error) {
      functions.logger.error("Error sending challenge emails:", error);
      return null;
    }
  });
