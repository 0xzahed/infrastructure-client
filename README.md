# Infrastructure Client - Civic Issue Reporting System

A comprehensive civic issue reporting and management platform built with React, featuring role-based access control for Citizens, Staff, and Admins.

## 🚀 Features

### Role-Based System

- **Citizens**: Report infrastructure issues, track status, upgrade to premium
- **Staff**: Manage assigned issues, update status, track work
- **Admin**: Assign issues, manage staff, control users

### Key Features

- 🔐 Firebase Authentication (Email/Password & Google Sign-in)
- 💳 Stripe Payment Integration for Premium
- 📍 Issue Tracking with Status Updates
- 🎨 Responsive Design (Tailwind CSS)
- 🔒 Protected Routes with Role-based Access
- 📊 Real-time Statistics Dashboard

## 🛠️ Technology Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Notifications**: React Toastify
- **Payment**: Stripe.js

## 📁 Project Structure

```
src/
├── Components/       # Reusable components
├── Context/          # AuthContext for authentication
├── Firebase/         # Firebase configuration
├── hooks/            # Custom hooks (useRole)
├── Pages/            # All page components
│   ├── Admin/        # Admin-only pages
│   └── Staff/        # Staff-only pages
├── Routes/           # Route protection components
└── Root/             # Layout components
```

## 🔐 Role System

### useRole Hook

```javascript
import useRole from "./hooks/useRole";

const { role, roleLoading } = useRole();
// role: 'citizen' | 'staff' | 'admin'
```

### Protected Routes

- `PrivateRoute`: Login required
- `AdminRoute`: Admin access only
- `StaffRoute`: Staff access only

## 🚦 Getting Started

### Prerequisites

```bash
Node.js >= 16.x
npm or yarn
```

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd infrastructure-client
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables
   Create `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

4. Start development server

```bash
npm run dev
```

5. Build for production

```bash
npm run build
```

## 📚 Documentation

For detailed documentation, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Development Team - Infrastructure Client Project

---

**Last Updated**: December 18, 2025
