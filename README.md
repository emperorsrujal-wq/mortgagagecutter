# Firebase Studio

This is a NextJS starter in Firebase Studio.

## How to Deploy Your App

To deploy your application and connect it to Firebase App Hosting, you need to push this code to your GitHub repository.

**Instructions for your developer:**

A developer will need to use the command line to do the following:
1. Initialize a Git repository in this directory.
2. Add your GitHub repository as the remote origin.
3. Commit all the files.
4. Push the files to the `main` branch of your GitHub repository.

**Example Commands:**
```bash
# This is a one-time setup
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

After you've pushed your code to GitHub, you can go back to the Firebase console and try connecting your App Hosting backend again. It will now find the `main` branch and the `/` root directory correctly.