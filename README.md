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