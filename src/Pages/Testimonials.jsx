import React from "react";
import { FaStar } from "react-icons/fa";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Kamal Ahmed",
      role: "Local Resident",
      text: "Reported a pothole and it was fixed within 3 days! This platform is amazing.",
      rating: 5,
      avatar: "K",
    },
    {
      name: "Fatima Begum",
      role: "Shop Owner",
      text: "Great platform for community issues. Very transparent and easy to use.",
      rating: 5,
      avatar: "F",
    },
    {
      name: "Rahim Khan",
      role: "Teacher",
      text: "Finally, a way to track infrastructure problems properly. Highly recommend!",
      rating: 5,
      avatar: "R",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          What Citizens{" "}
          <span style={{ color: "var(--color-primary)" }}>Say</span>
        </h2>
        <p className="text-gray-600 text-lg">
          Real feedback from our community members
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[var(--color-primary)] hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-bold text-xl">
                {testimonial.avatar}
              </div>
              <div className="ml-4">
                <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
            <div className="flex gap-1 text-yellow-500">
              {[...Array(testimonial.rating)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
