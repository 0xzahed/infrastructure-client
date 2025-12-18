import React, { useState } from "react";
import {
  HiLocationMarker,
  HiPhone,
  HiMail,
  HiPaperAirplane,
} from "react-icons/hi";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="mt-16 bg-[#FAF6F3] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"
              alt="Contact Us"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

            {/* Contact Info Card */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Visit Us</h2>
              <p className="text-sm md:text-base mb-8 text-gray-200">
                We love visitors! Come meet our team at our office.
              </p>

              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <HiLocationMarker className="w-6 h-6 mt-1" />
                  <div>
                    <p className="font-medium">Mirpur 1, Dhaka</p>
                    <p className="text-sm text-gray-300">Bangladesh</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HiPhone className="w-6 h-6" />
                  <p>01744546898</p>
                </div>

                <div className="flex items-center gap-3">
                  <HiMail className="w-6 h-6" />
                  <p>contact@citywatch.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let's <span style={{ color: "var(--color-primary)" }}>Talk</span>
            </h2>
            <p className="text-gray-600 mb-8">
              Questions about reporting issues? Or just want to say hi? Fill out
              the form below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  rows="5"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                style={{ backgroundColor: "var(--color-primary)" }}
                className="w-full px-6 py-4 text-white rounded-lg transition-colors font-semibold text-base uppercase flex items-center justify-center gap-2"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "black")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-primary)")
                }
              >
                Send Message
                <HiPaperAirplane className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
