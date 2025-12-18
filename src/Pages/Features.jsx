import React from "react";
import {
  HiLightningBolt,
  HiShieldCheck,
  HiChartBar,
  HiUserGroup,
  HiStar,
  HiDeviceMobile,
} from "react-icons/hi";

const Features = () => {
  const features = [
    {
      icon: HiLightningBolt,
      title: "Fast Response",
      description: "Quick turnaround time on reported issues",
    },
    {
      icon: HiShieldCheck,
      title: "Secure Platform",
      description: "Your data is safe with us",
    },
    {
      icon: HiChartBar,
      title: "Real-time Tracking",
      description: "Monitor your issue status anytime",
    },
    {
      icon: HiUserGroup,
      title: "Community Driven",
      description: "Powered by active citizen participation",
    },
    {
      icon: HiStar,
      title: "Priority Support",
      description: "Premium users get faster resolution",
    },
    {
      icon: HiDeviceMobile,
      title: "Mobile Friendly",
      description: "Report issues from anywhere",
    },
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose{" "}
            <span style={{ color: "var(--color-primary)" }}>CityWatch</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Making infrastructure reporting simple and effective
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border-t-4 border-[var(--color-primary)]"
            >
              <div className="flex justify-center mb-4">
                <feature.icon
                  className="text-5xl"
                  style={{ color: "var(--color-primary)" }}
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
