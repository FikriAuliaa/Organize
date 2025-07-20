import React from "react";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <div>
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
    </div>
  );
};
export default LandingPage;
