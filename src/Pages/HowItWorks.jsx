import React from "react";
import { Link } from "react-router";
import {
  HiCamera,
  HiLocationMarker,
  HiUpload,
  HiBell,
  HiCheckCircle,
  HiUserGroup,
  HiCurrencyDollar,
  HiStar,
  HiLightningBolt,
  HiShieldCheck,
} from "react-icons/hi";
import {
  MdRoad,
  MdElectricalServices,
  MdWaterDrop,
  MdDelete,
  MdWaves,
  MdLightbulb,
} from "react-icons/md";
import { useAuth } from "../Context/AuthContext";

const STEPS_DATA = [
  {
    icon: HiCamera,
    title: "Spot an Issue",
    description:
      "Notice a problem in your area? A pothole, broken street light, or water leakage? Take a quick photo of the issue.",
    color: "bg-blue-500",
  },
  {
    icon: HiLocationMarker,
    title: "Add Location",
    description:
      "Mark the exact location of the issue on the map or enter the address manually for accurate reporting.",
    color: "bg-green-500",
  },
  {
    icon: HiUpload,
    title: "Submit Report",
    description:
      "Fill in the details, select the category, and submit your report. It only takes a minute!",
    color: "bg-purple-500",
  },
  {
    icon: HiBell,
    title: "Track Progress",
    description:
      "Monitor your reported issue in real-time. Get notified when status changes from pending to in-progress to resolved.",
    color: "bg-yellow-500",
  },
  {
    icon: HiUserGroup,
    title: "Community Support",
    description:
      "Other citizens can upvote your issue to increase its visibility and priority for faster resolution.",
    color: "bg-pink-500",
  },
  {
    icon: HiCheckCircle,
    title: "Get It Resolved",
    description:
      "Authorities review and address the issue. You'll be notified once the problem is resolved!",
    color: "bg-orange-500",
  },
];

const FEATURES_DATA = [
  {
    title: "Free Reports",
    description: "Report up to 3 issues per month for free",
    icon: HiCurrencyDollar,
  },
  {
    title: "Premium Unlimited",
    description: "Upgrade to premium for unlimited issue reporting",
    icon: HiStar,
  },
  {
    title: "Priority Boost",
    description:
      "Boost important issues to high priority for faster attention",
    icon: HiLightningBolt,
  },
  {
    title: "Real-time Updates",
    description: "Get instant notifications on issue status changes",
    icon: HiBell,
  },
];

const CATEGORIES_DATA = [
  {
    name: "Road Issues",
    icon: MdRoad,
    examples: "Potholes, cracks, damaged roads",
  },
  {
    name: "Electricity",
    icon: MdElectricalServices,
    examples: "Power outages, damaged poles",
  },
  {
    name: "Water Supply",
    icon: MdWaterDrop,
    examples: "Leakages, supply issues",
  },
  {
    name: "Waste Management",
    icon: MdDelete,
    examples: "Garbage collection, cleanliness",
  },
  {
    name: "Drainage",
    icon: MdWaves,
    examples: "Blocked drains, flooding",
  },
  {
    name: "Street Lights",
    icon: MdLightbulb,
    examples: "Broken lights, dark areas",
  },
];

const FAQ_DATA = [
  {
    question: "How many issues can I report?",
    answer:
      "Free users can report up to 3 issues per month. Premium members enjoy unlimited reporting.",
  },
  {
    question: "How long does it take to resolve issues?",
    answer:
      "Resolution time varies based on issue severity and type. High priority issues are addressed faster. You can track progress in real-time.",
  },
  {
    question: "Can I upvote other people's reports?",
    answer:
      "Yes! Upvoting helps prioritize issues. The more upvotes an issue gets, the higher its visibility to authorities.",
  },
  {
    question: "What is priority boosting?",
    answer:
      "Priority boosting moves your issue to high priority status for faster resolution. This feature requires a small payment.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "Yes, registration is required to report and track issues. It helps maintain accountability and allows you to receive updates.",
  },
];

const HowItWorks = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <div
        style={{ backgroundColor: "var(--color-primary)" }}
        className="text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">How CityWatch Works</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Making your city better, one report at a time. Learn how our
            platform helps you report and track infrastructure issues.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Simple 6-Step Process</h2>
          <p className="text-gray-600 text-lg">
            Report issues in minutes and make a difference in your community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STEPS_DATA.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border-t-4 border-[var(--color-primary)] p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`${step.color} text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mr-4`}
                  >
                    {index + 1}
                  </div>
                  <IconComponent className="w-10 h-10 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Issue Categories</h2>
            <p className="text-gray-600 text-lg">
              Report issues across various infrastructure categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES_DATA.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border-t-4 border-[var(--color-primary)] shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <IconComponent className="text-5xl mb-3 text-[var(--color-primary)]" />
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.examples}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Platform Features</h2>
          <p className="text-gray-600 text-lg">
            Everything you need to report and track issues efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES_DATA.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border-t-4 border-[var(--color-primary)] p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <IconComponent className="text-5xl mb-4 mx-auto text-[var(--color-primary)]" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {FAQ_DATA.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-[var(--color-primary)] hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{ backgroundColor: "var(--color-primary)" }}
        className="text-white py-16"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of citizens working together to improve our city's
            infrastructure
          </p>
          {user ? (
            <Link
              to="/all-issues"
              className="inline-block bg-white text-[var(--color-primary)] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Browse All Issues
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-block bg-white text-[var(--color-primary)] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get Started Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
