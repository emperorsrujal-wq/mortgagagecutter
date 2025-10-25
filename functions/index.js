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
 * Triggers when a new user signs up and sends them a welcome email.
 *
 * This function is triggered by Firebase Authentication's `onCreate` event.
 * It creates a new document in the `mail` collection in Firestore. The
 * "Trigger Email" Firebase Extension listens to this collection and sends
 * the actual email.
 */
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const { email, displayName } = user;

  if (!email) {
    console.log(`User ${user.uid} has no email address. Cannot send welcome email.`);
    return null;
  }

  // The email document to be saved in the `mail` collection.
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

  // Add the email document to the 'mail' collection.
  return admin.firestore().collection("mail").add(mailEntry);
});
