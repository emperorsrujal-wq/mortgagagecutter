
"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  functions.logger.log("Attempting to send welcome email for user:", {
    uid: user.uid,
    email: user.email,
  });

  if (!user.email) {
    functions.logger.log("No email found for user, cannot send welcome email.");
    return null;
  }

  // Use the display name, but provide a fallback if it's not available
  const recipientName = user.displayName || 'Homeowner';

  const mailData = {
    to: [user.email],
    template: {
      name: "welcome",
      data: {
        name: recipientName,
        questionnaire_url: "https://mortgagecutter.com/questionnaire",
      },
    },
  };

  try {
    // The "Trigger Email" extension works by listening for new documents
    // in a specific collection (usually 'mail'). We add a document here to trigger it.
    await admin.firestore().collection("mail").add(mailData);
    functions.logger.log("SUCCESS: Welcome email document created in Firestore for:", user.email);
    return null;
  } catch (error) {
    functions.logger.error("FATAL ERROR: Could not create email document in Firestore:", {
      email: user.email,
      error: error.message,
      stack: error.stack,
    });
    return null;
  }
});
