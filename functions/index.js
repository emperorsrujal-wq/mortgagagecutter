
"use strict";

const {onUserCreated} = require("firebase-functions/v2/auth");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendWelcomeEmail = onUserCreated(async (event) => {
  const user = event.data;
  const userEmail = user.email;
  const displayName = user.displayName || 'Homeowner';

  if (!userEmail) {
    functions.logger.log(`Welcome email not sent for UID ${user.uid} because email is missing.`);
    return;
  }

  const mailData = {
    to: [userEmail],
    template: {
      name: "welcome",
      data: {
        name: displayName,
        questionnaire_url: "https://mortgagecutter.com/questionnaire",
      },
    },
  };

  try {
    const writeResult = await admin.firestore().collection("mail").add(mailData);
    functions.logger.log(`Successfully created email document ${writeResult.id} for: ${userEmail}`);
  } catch (error) {
    functions.logger.error(`FATAL: Could not create email document for ${userEmail}. Error: ${error.message}`, {
      structuredData: true,
      error: error
    });
  }
});
