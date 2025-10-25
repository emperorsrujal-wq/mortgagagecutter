
"use strict";

const functions = require("firebase-functions");

/**
 * A simple test function to confirm deployment.
 * This function logs a message when a new user is created.
 */
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  functions.logger.log("SUCCESS: sendWelcomeEmail function was triggered for user:", {
    uid: user.uid,
    email: user.email,
  });
  return null;
});
