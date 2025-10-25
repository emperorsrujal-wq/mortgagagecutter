
/**
 * Copyright 2022 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

/**
 * Triggers when a new user signs up and creates an email document in Firestore.
 */
exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  functions.logger.log("Function triggered for new user:", { uid: user.uid, email: user.email });

  if (!user.email) {
    functions.logger.warn(`User ${user.uid} has no email address. Cannot create mail document.`);
    return null;
  }

  const { email, displayName } = user;

  const mailEntry = {
    to: [email],
    message: {
      subject: "Welcome to Mortgage Cutter!",
      html: `
        <p>Hi ${displayName || 'there'},</p>
        <p>Welcome! We're thrilled to have you with us.</p>
        <p>You're one step closer to understanding how to pay off your mortgage years faster. You can get started right away by using our free estimator:</p>
        <p><a href="https://mortgagecutter.com/questionnaire">Calculate Your Savings Now</a></p>
        <p>If you have any questions, just reply to this email.</p>
        <p>To your financial freedom,<br>The Mortgage Cutter Team</p>
      `,
    },
  };

  try {
    const writeResult = await admin.firestore().collection("mail").add(mailEntry);
    functions.logger.log("SUCCESS: Mail document created successfully.", { docId: writeResult.id, userId: user.uid });
    return writeResult;
  } catch (error) {
    functions.logger.error("FATAL ERROR: Failed to create mail document in Firestore.", { userId: user.uid, error: error.message });
    // This error is critical because if this fails, the extension will never see the email request.
    throw new functions.https.HttpsError('internal', 'Failed to write to Firestore.', error);
  }
});
