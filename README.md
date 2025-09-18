Civic Management App

A crowdsourced civic issue reporting and resolution system.
This project consists of a mobile-first citizen reporting app and a web-based admin portal, allowing 
users to report issues (like potholes, garbage overflow, or faulty street lights) with photos, location, 
and tags. Administrators can manage, filter, and resolve reported issues with transparency and analytics.

🚀 Features
Citizen App (Frontend - React Native)

Report civic issues with:
      Photo upload 📷
      Auto-detected location 📍
      Predefined issue tags 🏷️
      Description ✍️
    View all reported issues (status updates in real time).
    Mobile-first design for easy citizen reporting.

Admin Portal (Frontend - React + Vite):
    Dashboard with all reported issues.
    Update issue status (e.g., Pending → In Progress → Resolved).
    Delete/Manage reports.
    Filtering by tags and status.
    Statistics page:
        📊 Summary cards (total, resolved, pending issues)
        📈 Line graph (issues per day)
        🏆 Top reporters leaderboard
        ⏱️ Avg. resolution time
        📰 Latest 5 reported issues

Backend (Node.js + Express):
    User & Admin authentication (JWT-based).
    Role-based access (separate tables for users and admins).
    Issue management API (report, view, filter, update).
    Cloudinary integration for image uploads.
    PostgreSQL + PostGIS for spatial data.

🛠️ Tech Stack:
    Frontend (Citizen App): React Native, Expo
    Frontend (Admin Portal): React, Vite, Axios
    Backend: Node.js, Express, JWT, Multer, Cloudinary
    Database: PostgreSQL + PostGIS
    Deployment: Netlify (frontend), Render/Heroku (backend)
