import { createBrowserRouter } from "react-router";
import Root from "../Root/Root";
import AuthLayout from "../Auth/AuthLayout";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import Home from "../Pages/Home";
import Contact from "../Pages/Contact";
import About from "../Pages/About";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import ForgotPassword from "../Pages/ForgotPassword";
import Profile from "../Pages/Profile";
import AllIssues from "../Pages/AllIssues";
import HowItWorks from "../Pages/HowItWorks";
import IssueDetails from "../Pages/IssueDetails";
import ReportIssue from "../Pages/ReportIssue";
import MyIssues from "../Pages/MyIssues";
import NotFound from "../Pages/NotFound";

// Admin Pages
import AdminDashboard from "../Pages/Admin/AdminDashboard";
import AdminAllIssues from "../Pages/Admin/AdminAllIssues";
import ManageUsers from "../Pages/Admin/ManageUsers";
import ManageStaff from "../Pages/Admin/ManageStaff";
import AdminPayments from "../Pages/Admin/AdminPayments";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "all-issues",
        Component: AllIssues,
      },
      {
        path: "issues/:id",
        Component: IssueDetails,
      },
      {
        path: "report-issue",
        element: (
          <PrivateRoute>
            <ReportIssue />
          </PrivateRoute>
        ),
      },
      {
        path: "my-issues",
        element: (
          <PrivateRoute>
            <MyIssues />
          </PrivateRoute>
        ),
      },
      {
        path: "how-it-works",
        Component: HowItWorks,
      },
      {
        path: "contact",
        Component: Contact,
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "test-auth",
        Compone: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    Component: Root,
    children: [
      {
        path: "dashboard",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: "all-issues",
        element: (
          <AdminRoute>
            <AdminAllIssues />
          </AdminRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "manage-staff",
        element: (
          <AdminRoute>
            <ManageStaff />
          </AdminRoute>
        ),
      },
      {
        path: "payments",
        element: (
          <AdminRoute>
            <AdminPayments />
          </AdminRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <AdminRoute>
            <Profile />
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "forgot-password",
        Component: ForgotPassword,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
