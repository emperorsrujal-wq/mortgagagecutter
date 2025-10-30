
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

/**
 * A Cloud Function that triggers when a new user is created in Firebase Auth.
 * It creates a new document in the "mail" collection to send a welcome email
 * via the "Trigger Email" Firebase Extension.
 */
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const { email } = user;

  if (!email) {
    console.error("No email found for new user:", user.uid);
    return;
  }

  const mailRef = db.collection("mail");

  const mailData = {
    to: [email],
    message: {
      subject: "Welcome to Mortgage Cutter!",
      html: `<p>Welcome to your financial freedom journey. Get started by filling out our questionnaire.</p><p>You can access the questionnaire here: <a href="https://mortgagecutter.com/questionnaire">https://mortgagecutter.com/questionnaire</a></p>`,
    },
  };

  return mailRef.add(mailData)
    .then(() => {
      console.log("Successfully queued welcome email for:", email);
    })
    .catch((error) => {
      console.error("Error queuing welcome email for:", email, error);
    });
});
