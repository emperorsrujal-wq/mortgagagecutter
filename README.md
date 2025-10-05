# Firebase Studio

This is a NextJS starter in Firebase Studio.

## How to Deploy Your App & Connect to a Custom Domain

To get your app live on the internet with a custom domain, you first need to publish the code to a GitHub repository. Firebase will then use this repository to build and deploy your app.

There are two ways to do this:

1.  **The Developer Method (Recommended):** A developer uses command-line tools. This is faster and the standard professional practice.
2.  **The Manual Method:** You can do this yourself by uploading files directly on the GitHub website.

Once this one-time setup is complete and your code is on GitHub, connecting it in Firebase is simple.

---

### Option 1: The Developer Method (Using Command Line)

Provide these instructions to a developer or a technical friend. They will need `git` installed on their computer.

**Step 1: Download the Project Code**

Download the complete source code of this project as a ZIP file and unzip it on your local machine.

**Step 2: Initialize a Git Repository & Push to GitHub**

Open a terminal or command prompt, navigate into the unzipped project folder, and run the following commands one by one.

**Important:** Replace `https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git` with the actual URL of the new, empty repository you created on GitHub.

```bash
# This is a one-time setup

# Initialize a new Git repository in the project folder
git init -b main

# Add your empty GitHub repository as the destination
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# Add all the project files for tracking
git add .

# Save the files with a commit message
git commit -m "Initial commit from Firebase Studio"

# Push all the code to your GitHub repository
git push -u origin main
```

---

### Option 2: The Manual Method (Do It Yourself)

You can do this yourself without any special tools.

1.  **Download the Code:** Download the complete source code of this project as a ZIP file and unzip it on your computer.
2.  **Go to Your GitHub Repository:** Open your browser and go to the empty repository you created.
3.  **Upload Files:** Find the link that says **"uploading an existing file"** and click it.
4.  **Drag and Drop:** Drag all the individual files and folders from the unzipped folder on your computer into the browser window.
5.  **Commit Changes:** Wait for all files to upload. Then, scroll to the bottom, and click the green **"Commit changes"** button.

---

### Step 3: Connect Firebase App Hosting

Once the code is on GitHub (using either method), you can go back to the Firebase Console and connect your App Hosting backend again.

It will now work correctly with these settings:
- **GitHub Repository:** Select the repository you just pushed the code to.
- **Live branch:** `main`
- **Root directory:** `/`

After Firebase is connected to GitHub, you can proceed to add your custom domain.
