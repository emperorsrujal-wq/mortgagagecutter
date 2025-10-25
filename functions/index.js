
"use strict";

const functions = require("firebase-functions");

/**
 * Triggers when a new user signs up.
 * This is a simplified test function to confirm deployment.
 */
exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  functions.logger.log("SUCCESS: sendWelcomeEmail function was triggered for user:", { uid: user.uid, email: user.email });
  return null;
});
