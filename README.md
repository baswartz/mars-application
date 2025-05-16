Mars Travel Application Form

Overview

This project is a multi-stage application form for a fictional Mars travel program, created as part of the Coziitech Software Developer Intern Assessment. It collects and validates user information across three logical stages using modern frontend technologies.

Technologies Used

Frontend: Next.js 14, TypeScript, Tailwind CSS, React Hook Form, Zod

Backend: Next.js API Routes (no separate server)

Date Picker: MUI X DateRangePicker (Pro version)

Features

1. Multi-Stage Form Flow

Stage 1: Personal Information

Stage 2: Travel Preferences

Stage 3: Health and Safety

Progress bar with step indication and transitions

2. Form Validation (Zod)

Required fields

Proper format for email and phone

Valid date format and date ranges

Conditional logic (e.g., departure must be before return)

3. Responsive Design

Fully mobile-friendly layout

Styled using Tailwind CSS

Animated transitions with Framer Motion

4. API Route Submission

Form data is submitted to a Next.js API route for processing

API endpoint: /api/form

5. Visual Flair

Animated starfield background for immersive space theme

File Structure

form.tsx - Main form logic and UI

schema.ts - Zod validation schema

pages/api/form.ts - API handler for form submission

Starfield.tsx - Background animation

Instructions to Run Locally

Clone the repo

Install dependencies:

npm install

Run development server:

npm run dev

Visit http://localhost:3000 in your browser

Deployment

Hosted on: Vercel

Frontend and backend live in one unified project via Next.js API routes

Live demo: https://mars-application-frontend.vercel.app/

Future Improvements

Add unit tests with Jest or Cypress

Add user authentication

Save form progress in local storage

Credits

Submitted by: Benjamin Swartz
For: Coziitech Software Developer Intern Assessment 2025
