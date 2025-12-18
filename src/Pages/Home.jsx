import React from "react";
import Header from "../Components/Header/Header";
import Stats from "./Stats";
import LatestResolvedIssues from "./LatestResolvedIssues";
import Features from "./Features";
import Testimonials from "./Testimonials";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Stats />
      <LatestResolvedIssues />
      <Features />
      <Testimonials />
    </div>
  );
};

export default Home;
