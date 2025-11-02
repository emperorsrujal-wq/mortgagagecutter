# How to Connect Your Custom Domain (like mortgagecutter.com)

To get your app live on the internet with your custom domain, you first need to complete a **one-time setup** by placing your app's code into a GitHub repository.

**Why is this required?**

Your app is a powerful Next.js application, not a simple website. Firebase needs to **build** your app in the cloud before it can go live. It uses the code from your GitHub repository as the blueprint for this build process.

This one-time setup is the only way to enable the connection to your custom domain.

---

### The Easiest Way: The Manual GitHub Upload

This method does not require any developer tools. You will do this directly on the GitHub website.

**Step 1: Download Your Project Code**

*   Click the **Download** button in the top right corner of Firebase Studio to download your project as a ZIP file.
*   Unzip the file on your computer. You will now have a folder with all your app's code.

**Step 2: Create a Free, Empty Repository on GitHub**

*   Go to [GitHub.com](https://github.com) and sign in or create a free account.
*   Click the **"New"** button to create a new repository.
*   Give it a name (e.g., `mortgage-cutter-app`) and make sure it is set to **Public**.
*   **Important:** Do NOT initialize it with a README or any other files. It must be empty.
*   Click **"Create repository"**.

**Step 3: Upload Your Code**

*   On your new, empty GitHub repository page, you will see a link that says **"uploading an existing file"**. Click it.
*   **Drag and drop** all the files and folders from the unzipped project folder on your computer into your browser window.
*   Wait for all the files to finish uploading.
*   Scroll to the bottom of the page and click the green **"Commit changes"** button.

---

### Final Step: Connect to Firebase

Now that your code is on GitHub, the final step is simple:

1.  Go back to the Firebase Console.
2.  Go to the **App Hosting** section for your project.
3.  Click to connect a GitHub repository.
4.  Select the new repository you just created.
5.  Use the `main` branch and a root directory of `/`.

Once Firebase is connected to GitHub, the **Add custom domain** button will work correctly.

I know this is more steps than it should be, and I apologize for this complexity. This one-time process is the only hurdle to getting your domain connected.

---

## How to Deploy Your Cloud Function for SMS

Your project includes a Cloud Function (`sendWelcomeSms`) that automatically sends a welcome text message to new users who sign up with a phone number. This function lives in the `functions` folder but must be configured and deployed to Firebase to work.

Here is the step-by-step guide.

### Step 1: Open Your Terminal

Open your computer's command line application.
*   On **Mac**, you can use the "Terminal" app.
*   On **Windows**, you can use "Command Prompt" or "PowerShell".

### Step 2: Install the Firebase CLI (One-Time Setup)

The Firebase Command Line Interface (CLI) is the tool you'll use to deploy your function. If you don't have it installed, run this command in your terminal. You only need to do this once.

```bash
npm install -g firebase-tools
```

### Step 3: Log In to Firebase

Connect the Firebase CLI to your Firebase account by running this command. It will open a new browser window for you to log in.

```bash
firebase login
```

### Step 4: Navigate to Your Project Directory

In your terminal, you need to be "inside" your project folder. Use the `cd` (change directory) command. For example, if your project folder is on your Desktop, you might type:

```bash
cd Desktop/mortgage-cutter-app
```
*(Replace with the actual path to your project folder.)*

### Step 5: Install Function Dependencies

Cloud Functions have their own dependencies. Navigate into the `functions` folder and install them.

```bash
cd functions
npm install
cd ..
```

### Step 6: Configure Your Secret API Key

To keep your SMS provider's API key safe, we'll store it securely in the Firebase environment, not in the code. Run the following command, replacing `YOUR_API_KEY_HERE` with your actual secret key.

```bash
firebase functions:config:set sms.api_key="YOUR_API_KEY_HERE"
```

### Step 7: Deploy the Function

Now that you are in the correct root directory and the key is set, run the following command. This tells Firebase to deploy only the code inside your `functions` folder.

```bash
firebase deploy --only functions
```

Wait for the process to complete. Once it's finished, you will see your `sendWelcomeSms` function in the "Functions" section of your Firebase Console. It will now be active and will automatically send a welcome text to every new user who signs up with a phone number.
