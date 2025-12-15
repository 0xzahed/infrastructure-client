import React from "react";
import { HiArrowRight } from "react-icons/hi";
import { AiFillStar } from "react-icons/ai";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import slide1 from "../../assets/slide1.jpg";
import slide2 from "../../assets/slide2.jpg";
import slide3 from "../../assets/slide3.jpg";
import slide4 from "../../assets/slide4.jpg";

const Header = () => {
  const slides = [
    {
      id: 1,
      image: slide1,
      subtitle: "Report & Track Issues",
      title: "Build a Better Community Together",
      description:
        "Help improve your community by reporting local infrastructure problems",
    },
    {
      id: 2,
      image: slide2,
      subtitle: "Real-Time Updates",
      title: "Track Issue Status Instantly",
      description: "Monitor the progress of reported issues in real-time",
    },
    {
      id: 3,
      image: slide3,
      subtitle: "Community Driven",
      title: "Join Thousands Making a Difference",
      description: "Be part of a growing community of active citizens",
    },
    {
      id: 4,
      image: slide4,
      subtitle: "Fast Response",
      title: "Get Quick Resolutions",
      description: "Receive updates and resolutions from authorities promptly",
    },
  ];

  return (
    <div className="mt-16 bg-[#FAF6F3]">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="h-[500px] md:h-[600px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
              <div className="flex flex-col lg:flex-row gap-8 items-center h-full py-8 lg:py-0">
                <div className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center items-center">
                  <div className="relative w-full">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] rounded-2xl shadow-2xl object-cover"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-1/2 order-2 lg:order-1 text-left">
                  <p
                    style={{ color: "var(--color-primary)" }}
                    className="text-sm md:text-base font-semibold mb-4 uppercase tracking-wide"
                  >
                    {slide.subtitle}
                  </p>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 lg:mb-8">
                    {slide.description}
                  </p>
                  <button
                    style={{ backgroundColor: "var(--color-primary)" }}
                    className="px-4 sm:px-6 py-2 sm:py-3 text-white rounded-lg transition-colors text-xs sm:text-sm md:text-base font-semibold uppercase inline-flex items-center gap-2"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "black")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--color-primary)")
                    }
                  >
                    Report an Issue
                    <HiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <div className="mt-4 lg:mt-6 flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <AiFillStar
                          key={star}
                          className="w-4 h-4 sm:w-5 sm:h-5"
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600">
                      Trusted by <strong>23,000+</strong> citizens
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Header;
