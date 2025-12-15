import React from "react";
import { Link } from "react-router";

const About = () => {
  const stats = [
    {
      number: "5000+",
      title: "Issues Resolved",
      description:
        "Successfully resolved infrastructure problems across the city",
    },
    {
      number: "100%",
      title: "Verified Reports",
      description:
        "We ensure all reports are reviewed and verified by authorities",
    },
    {
      number: "24/7",
      title: "Support",
      description: "Our dedicated team is always here to help you",
    },
  ];

  return (
    <div className="mt-16 bg-[#FAF6F3]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          About <span style={{ color: "var(--color-primary)" }}>CityWatch</span>
        </h1>
        <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
          Dedicated to building better communities through transparency and
          citizen engagement. We bridge the gap between residents and local
          authorities for faster infrastructure solutions.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-1">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"
              alt="City Infrastructure"
              className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-xl"
            />
          </div>

          <div className="order-2 lg:pl-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
              At CityWatch, we believe that every citizen deserves a safe,
              functional, and well-maintained community. Our platform was
              created to simplify the process of reporting infrastructure
              issues, tracking their resolution, and fostering community
              engagement.
            </p>
            <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed">
              Whether you're looking to report a pothole, broken streetlight, or
              any other public infrastructure issue in your area, we are here to
              make that process seamless and trustworthy. Together, we can build
              safer and better cities.
            </p>
            <Link
              to="/contact"
              style={{ backgroundColor: "var(--color-primary)" }}
              className="inline-block px-6 py-3 text-white rounded-lg transition-colors font-semibold uppercase"
              onMouseEnter={(e) => (e.target.style.backgroundColor = "black")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "var(--color-primary)")
              }
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-[#FAF6F3] rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3
                  style={{ color: "var(--color-primary)" }}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  {stat.number}
                </h3>
                <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {stat.title}
                </h4>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
