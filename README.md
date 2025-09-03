# Smart HealthMate

Welcome to **Smart HealthMate**, your personal AI-powered health and wellness companion. This application provides instant symptom analysis, personalized health recommendations, and a friendly AI chatbot to answer all your health questions.

**Repository:** [https://github.com/Bharanieeswaran/Smart-HealthMate.git](https://github.com/Bharanieeswaran/Smart-HealthMate.git)

## Features

-   **AI Symptom Checker**: Describe your symptoms and get instant, AI-driven insights into possible conditions and next steps.
-   **Personalized Recommendations**: Receive custom diet and exercise plans based on your unique health profile and goals.
-   **AI Health Chatbot**: Have a health question? Our friendly AI chatbot is available 24/7 to provide informative answers.
-   **Health Metrics Tracking**: Log your daily health vitals like blood pressure, blood sugar, and steps to monitor your progress over time.
-   **Medication & Reminders**: Keep track of your medications and set reminders for appointments or wellness activities.

## Tech Stack

-   **Framework**: Next.js
-   **Styling**: Tailwind CSS & ShadCN UI
-   **AI Integration**: Google Genkit
-   **Language**: TypeScript

## Running Locally

To run this project on your local machine, follow these steps.

### 1. Prerequisites

-   Make sure you have [Node.js](https://nodejs.org/) (version 18 or later) and npm installed.
-   You have cloned the repository to your local machine.

### 2. Install Dependencies

Open a terminal in the project directory and run the following command to install all the required packages:

```bash
npm install
```

### 3. Set Up Environment Variables

This project requires a Google Gemini API key to function.

1.  Make a copy of the `.env.example` file and rename it to `.env`.
2.  Open the new `.env` file.
3.  Replace `YOUR_API_KEY_HERE` with your actual Google AI Gemini API key.

Your `.env` file should look like this:
```
NEXT_PUBLIC_GEMINI_API_KEY=YOUR_API_KEY_HERE
```

### 4. Run the Development Servers

This project requires two services to be run concurrently in separate terminals.

**Terminal 1: Run the Next.js App**

```bash
npm run dev
```

This will start the main application, typically on `http://localhost:9002`.

**Terminal 2: Run the Genkit AI Service**

```bash
npm run genkit:dev
```

This starts the local Genkit server that handles the AI requests.

Your application should now be running successfully! You can open your browser to `http://localhost:9002` to see it in action.
