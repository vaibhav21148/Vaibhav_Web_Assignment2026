# ResolvIT — E-Cell IIT Bombay Query Management Portal

ResolvIT is a centralized query and issue management portal designed for the **E-Cell IIT Bombay** ecosystem. It streamlines informal queries into a structured resolution pipeline, facilitating efficient communication between users, domain managers, and administrators.

---

## 🚀 Key Features

-   **Role-Based Access Control**:
    -   **User**: Create and track own queries.
    -   **Manager**: Manage queries assigned to their specific portfolio (e.g., Marketing, Events).
    -   **Admin**: Global oversight of all users, queries, and system permissions.
-   **Portfolio-Specific Support**: Users can target queries to specialized E-Cell portfolios:
    -   Events, Marketing, Corporate Relations, Hospitality, Operations, Design, Web and Tech, and Media.
-   **Dynamic Admin Dashboard**: A comprehensive interface to manage user access, change roles, and oversee the status of all active queries.
-   **Security**: JWT-based authentication with secure session handling.

---

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
-   **Styling**: [TailwindCSS](https://tailwindcss.com/)
-   **Navigation**: [React Router](https://reactrouter.com/)
-   **Icons**: [Material Icons](https://fonts.google.com/icons)

### Backend
-   **Framework**: [Django](https://www.djangoproject.com/) + [Django REST Framework](https://www.django-rest-framework.org/)
-   **Database**: [MongoDB](https://www.mongodb.com/) (using `pymongo` for Python 3.13+ compatibility)
-   **Authentication**: [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/)

---

## ⚙️ Project Setup

### 1. Prerequisites
-   **Node.js** (v18+)
-   **Python** (v3.13+)
-   **MongoDB** (running locally on port 27017)

### 2. Backend Configuration
1.  Navigate to the `backend_core` directory:
    ```bash
    cd backend_core
    ```
2.  Install dependencies (using your preferred virtual environment):
    ```bash
    pip install django djangorestframework pymongo django-environ djangorestframework-simplejwt django-cors-headers bcrypt
    ```
3.  Ensure your `.env` file reflects your local environment:
    ```ini
    DEBUG=True
    MONGO_URI=mongodb://127.0.0.1:27017/resolvit
    SECRET_KEY=your-secret-key-here
    ```
4.  Start the server:
    ```bash
    python manage.py runserver
    ```

### 3. Frontend Configuration
1.  From the project root:
    ```bash
    npm install
    ```
2.  Launch the development server:
    ```bash
    npm run dev
    ```
3.  Access the application at `http://localhost:5173`.

---

## 📝 Usage Guide

-   **Registration**: Choose your role. If you are a **Manager**, you must select your assigned portfolio.
-   **Creating Queries**: Use the "Create Query" button to submit issues to specific domains. You can attach relevant files for context.
-   **Admin Access**: Log in with an admin account and navigate to the **Admin Panel** in the sidebar to manage all users and oversee global query progress.

---

## 📂 Project Structure

```text
├── backend_core/        # Django Backend
│   ├── backend_core/    # Settings & Root URLs
│   ├── queries/         # Query management logic & MongoDB models
│   ├── users/           # Authentication & User management
│   ├── tasks/           # Maintenance & Diagnostic scripts
│   └── manage.py
├── src/                 # React Frontend
│   ├── components/      # UI components (Shell, Sidebar, etc.)
│   ├── context/         # AuthContext for global state
│   ├── pages/           # Page views (Dashboard, Admin, QueryDetail)
│   └── App.jsx          # Root routing
└── README.md            # You are here!
```

---

*This project is built for the E-Cell IIT Bombay administrative team to enhance internal efficiency and support resolution.*
