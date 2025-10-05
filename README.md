# Firebase Studio

This is a NextJS starter in Firebase Studio.

## How to Deploy Your App & Connect to a Custom Domain

To get your app live on the internet with a custom domain, you first need to publish the code to a GitHub repository. Firebase will then use this repository to build and deploy your app.

This is a **one-time setup** that requires command-line tools.

**Instructions for your developer (or a technical friend):**

A developer needs to perform the following steps to get your code into GitHub.

### Step 1: Download the Project Code

Download the complete source code of this project as a ZIP file and unzip it on your local machine.

### Step 2: Initialize a Git Repository & Push to GitHub

Open a terminal or command prompt, navigate into the unzipped project folder, and run the following commands one by one.

**Important:** Replace `https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git` with the actual URL of the new, empty repository you created on GitHub.

```bash
# This is a one-time setup

# Initialize a new Git repository in the project folder
git init

# Set the main branch name to "main"
git branch -M main

# Add your empty GitHub repository as the destination
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# Add all the project files for tracking
git add .

# Save the files with a commit message
git commit -m "Initial commit from Firebase Studio"

# Push all the code to your GitHub repository
git push -u origin main
```

### Step 3: Connect Firebase App Hosting

Once the code is successfully pushed to GitHub, you can go back to the Firebase Console and connect your App Hosting backend again.

It will now work correctly with these settings:
- **GitHub Repository:** Select the repository you just pushed the code to.
- **Live branch:** `main`
- **Root directory:** `/`

After Firebase is connected to GitHub, you can proceed to add your custom domain.
