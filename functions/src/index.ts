
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";

// Initialize the Firebase Admin SDK
admin.initializeApp();

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
    // This uses Firebase environment configuration.
    // To set this, run in your terminal:
    // firebase functions:config:set sms.api_key="YOUR_API_KEY_HERE"
    // The key will be stored securely on the server.
    const apiKey = functions.config().sms.api_key;
    if (!apiKey) {
        functions.logger.error("FATAL: SMS API key is not configured. Set it with `firebase functions:config:set sms.api_key=...`");
        return null;
    }

    // --- Define the welcome message ---
    const welcomeMessage = "Welcome to Mortgage Cutter! We're excited to help you on your path to financial freedom. A specialist will review your details soon.";

    // --- Prepare the request for the external API ---
    // IMPORTANT: The structure of this body (e.g., 'to', 'from', 'body')
    // and the headers might be different for your specific SMS provider.
    // Check your provider's API documentation and adjust accordingly.
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
          // This is a common way to authenticate. Your provider might use
          // a different header like 'X-Api-Key' or Basic auth.
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        // The API returned an error
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
