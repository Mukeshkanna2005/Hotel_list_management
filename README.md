# Hotel Listing Application

A full-stack React + Redux Toolkit and Node.js/Express + PostgreSQL application for managing luxury hotel listings with live search, price filtering, pagination, full CRUD operations (add, edit, delete with image upload), detailed hotel views with embedded Google Maps, and dynamic SEO meta tags.

---

## Tech Stack

- **Frontend**: React 19, Redux Toolkit, React Router v7, Axios, React Helmet Async, Vite
- **Backend**: Node.js, Express, PostgreSQL (`pg`), Multer (file uploads), CORS, Dotenv
- **Database**: PostgreSQL 18

---

## Project Structure

```text
Hotel-list/
├── backend/
│   ├── config/
│   │   └── db.js                 # PostgreSQL connection pool configuration
│   ├── controllers/
│   │   └── hotelController.js    # Hotel CRUD controllers (SQL queries)
│   ├── routes/
│   │   └── hotelRoutes.js        # Express API routes & Multer upload middleware
│   ├── uploads/                  # Hotel image assets & uploads
│   ├── .env                      # Database & server environment variables
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies and scripts
│   ├── schema.sql                # PostgreSQL database schema and indexes
│   ├── seed.js                   # Database seeder (12 luxury hotels)
│   └── server.js                 # Express server entry point (Port 5000)
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg           # Application favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── HotelCard.jsx     # Hotel card with edit/delete buttons
│   │   │   ├── HotelForm.jsx     # Reusable form with validation & image upload
│   │   │   ├── Pagination.jsx    # Numeric pagination controls
│   │   │   ├── SearchFilter.jsx  # Search & price range filter component
│   │   │   └── SuccessPopup.jsx  # Notification toast
│   │   ├── pages/
│   │   │   ├── HotelDetailPage.jsx # Details view with coordinates & Google Map
│   │   │   ├── HotelFormPage.jsx   # Add & Edit hotel page
│   │   │   └── HotelListPage.jsx   # Grid listing with search, filter, and pagination
│   │   ├── services/
│   │   │   └── hotelApi.js       # Axios API client
│   │   ├── store/
│   │   │   ├── hotelSlice.js     # Redux Toolkit slice & async thunks
│   │   │   └── store.js          # Redux store configuration
│   │   ├── App.css               # Responsive design & modern aesthetics
│   │   ├── App.jsx               # Application routes
│   │   └── main.jsx              # React DOM mounting & Redux Provider
│   ├── package.json              # Frontend dependencies and scripts
│   └── vite.config.js            # Vite configuration with API & Uploads proxy
│
├── start-db.bat                  # One-click script to start PostgreSQL
└── README.md                     # Project documentation
```

---

## Setup & Running Locally

### 1. Database Setup
1. Ensure PostgreSQL is running on port `5432`.
2. Double-click `start-db.bat` or run:
   ```bash
   cd backend
   npm run db:start
   ```
3. Populate the initial 12 luxury hotels:
   ```bash
   npm run seed
   ```

### 2. Start the Backend
In a terminal:
```bash
cd backend
npm install
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Start the Frontend
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## Features

- **Full CRUD Operations**: Create, read, update, and delete hotels with image uploads.
- **PostgreSQL Database Persistence**: All changes persist to PostgreSQL.
- **Search & Price Range Filter**: Instant title filtering and minimum/maximum price controls.
- **Pagination**: Browse listings easily across pages.
- **Embedded Interactive Google Maps**: Visual location based on latitude and longitude coordinates.
- **Form Validation**: Client-side validation ensuring valid titles, descriptions, positive prices, and coordinate ranges.
- **Dynamic SEO**: Individual `<title>` and `<meta name="description">` tags on every page via `react-helmet-async`.
