import { createBrowserRouter } from "react-router";
import Root from "../Root/Root";
import AuthLayout from "../Auth/AuthLayout";
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
        Component: ReportIssue,
      },
      {
        path: "my-issues",
        Component: MyIssues,
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
        path: "profile",
        Component: Profile,
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
]);
