
# 🏗️ ProStruct Engineering – Software Engineer/Intern Assignment

This project demonstrates integration with HubSpot CRM, API development, data management, and building an interactive UI with role-based filtering and geolocation features. It simulates a real-world scenario to manage contact data and visualize it on a map using distinct role-based markers.

## Features

🔗 Integration with HubSpot API using private app token

👤 Creation of 10 contacts with custom "Project Role" property

⚙️ Custom multiple select property setup: project_role

🔍 Backend API to fetch contacts with non-null project roles

🗺️ Interactive map UI using React and Google Maps API

📍 Multiple markers/icons at same location for multi-role contacts

🧭 Legend to distinguish role icons

🧵 Role and location-based filtering system

💡 Smart contact suggestions based on selected filters


## 🔧 Tech Stack

Frontend:
- React.js
- Tailwind CSS 
- Leaflet.js (For Map)

Backend:
- Node.js + Express.js
- HubSpot API

## 🧪 API Endpoint

- Method : GET
- Endpoint : /api/contacts
- Description : Fetch contacts with non-null project_role field
## 🗺️ Map Interface

Each contact is plotted based on their address

Custom icon per role:

- Contractor → Star
- Home Owner → Home
- Affiliate → Circle
- Referral Partner → Diamond
- Community Partner → Square
- Geo Tech → Triangle


Multiple icons shown if contact has multiple roles

Legend included for icon clarity
## 🧰 Role & Location Filters

Dropdowns or checkboxes to filter by:
- One or more roles
- Specific city, region, or state

Smart suggestions like:
- “You can contact Jane Doe in San Diego as a Geo Tech.”
## 🔗 Links

GitHub Repository : https://github.com/deepak04iiitn/ProStruct_Assignment

Live Deployment : https://pro-struct-frontend.vercel.app/

My LinkedIn : https://www.linkedin.com/in/deepak-kumar-yadav-a0653b248/
