
"use strict";

const {onUserCreated} = require("firebase-functions/v2/auth");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendWelcomeEmail = onUserCreated(async (event) => {
  const user = event.data;

  functions.logger.log("v2: Attempting to send welcome email for user:", {
    uid: user.uid,
    email: user.email,
  });

  if (!user.email) {
    functions.logger.log("No email found for user, cannot send welcome email.");
    return;
  }

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
    await admin.firestore().collection("mail").add(mailData);
    functions.logger.log("SUCCESS: v2: Welcome email document created in Firestore for:", user.email);
  } catch (error) {
    functions.logger.error("FATAL ERROR: v2: Could not create email document in Firestore:", {
      email: user.email,
      error: error.message,
      stack: error.stack,
    });
  }
});
