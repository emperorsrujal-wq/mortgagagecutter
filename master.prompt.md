
# Master Prompt: Mortgage Freedom Accelerator Application

## High-Level Concept

Build a comprehensive web application called **"Mortgage Freedom Accelerator"**. The primary goal of this application is to serve as a lead generation and educational tool for a financial strategy known as the "Mortgage Cutter Method." The app will attract users with a free savings calculator, capture their information, show them the potential benefits of the method, and provide a pathway to purchase the full method.

## Technology Stack

*   **Framework:** Next.js with the App Router
*   **Language:** TypeScript
*   **UI Components:** shadcn/ui
*   **Styling:** Tailwind CSS
*   **Authentication & Database:** Firebase (Authentication and Firestore)
*   **Email:** Firebase "Trigger Email" extension integrated with SendGrid.
*   **AI/Generative:** Genkit for any AI-powered report generation.

## Core Features

### 1. **Homepage & Lead Capture**
- A visually compelling hero section with a strong headline (e.g., "Cut 8-12 Years Off Your Mortgage").
- A brief explanation of the benefits: save money on interest, pay off the mortgage faster without changing banks.
- A prominent lead-capture form directly in the hero section to collect the user's **name** and **email**. This form should handle user registration.
- Social proof sections with testimonials (e.g., "Saved $42,000 in interest").
- A "How It Works" section explaining the process in three simple steps (Enter Details -> See Savings -> Start Saving).
- An FAQ section to address common user objections.

### 2. **User Authentication**
- Users should be able to sign up using their **email and password**.
- Also, provide social sign-in options for **Google** and **Apple**.
- Upon successful registration, the user should be automatically logged in and redirected to the `/questionnaire` page.

### 3. **Welcome Email on Signup**
- On every new user registration, a document must be written to a Firestore collection named `mail`.
- This document must trigger the Firebase "Trigger Email" extension to send a welcome email via SendGrid.
- The document structure must be:
  ```json
  {
    "to": "newuser@email.com",
    "message": {
      "subject": "Welcome to Mortgage Cutter!",
      "html": "<p>Welcome to your financial freedom journey. Get started by filling out our questionnaire.</p>"
    }
  }
  ```

### 4. **Mortgage Questionnaire (`/questionnaire`)**
- A multi-step, user-friendly form to collect the user's financial data.
- **Required Fields:**
    - Current Home Value ($)
    - Mortgage Balance ($)
    - Mortgage Interest Rate (APR %)
    - Remaining Amortization (Years)
    - Net Monthly Income ($)
    - Monthly Expenses (excluding debt payments) ($)
- Upon submission, the form data should be URL-encoded and passed as query parameters to the `/comparison` page.

### 5. **Savings Comparison Engine & Results Page (`/comparison`)**
- This page dynamically calculates and displays the savings achieved via the "Mortgage Cutter Method" versus a traditional mortgage.
- It should read the financial data from the URL query parameters.
- **Display Key Metrics:**
    - **Total Interest Saved:** The difference in interest paid between the two methods.
    - **Years to Payoff:** Show the original payoff timeline vs. the new, accelerated timeline.
    - **Debt-Free Date:** The new date the user will be debt-free.
- **Visualizations:** Include a chart (e.g., an area chart) that visually compares the loan balance depletion over time for both the traditional and accelerated paths.
- **Call to Action (CTA):** After showing the results, present clear pricing tiers and CTAs for the user to purchase the full method.

### 6. **Purchase & Method Access**
- A `/purchase` page that can handle different pricing plans passed via a URL parameter (e.g., `/purchase?plan=pro_197`). It should display the plan details and a secure link to a payment processor like Stripe.
- A `/method-access` page for users who have completed a purchase. This page serves as a portal to the paid content, calculators, and resources. It should be a protected route, notionally.

### 7. **Blog & Content Pages**
- Create a functional blog at `/blog` that lists all articles.
- Each blog post should have its own dynamic page at `/blog/[slug]`.
- The blog content should be SEO-optimized with proper metadata, H1 tags, and structured data (schema).
- Create a `/learn` page that explains the core concepts of the method and includes a detailed FAQ section.

## Style & UI Guidelines

- **Primary Color:** Professional Blue (`#29ABE2`)
- **Accent Color:** Gold (`#FFD700`) for highlighting savings and benefits.
- **Background Color:** Light Gray (`#F5F5F5` or equivalent `hsl` in `globals.css`).
- **Font:** Use 'Inter' for both body and headlines for a modern, readable look.
- **Components:** Use `shadcn/ui` components for consistency (Cards, Buttons, Forms, etc.). UI should be clean, modern, and professional with rounded corners and subtle shadows.
- **Icons:** Use the `lucide-react` library for all icons.

## SEO & Metadata

- Implement robust metadata for all pages, especially the homepage and blog posts.
- Use `sitemap.ts` to generate a dynamic sitemap.
- Implement structured data (JSON-LD/Schema.org) for `BlogPosting`, `FAQPage`, and `Organization` to improve search engine visibility.
