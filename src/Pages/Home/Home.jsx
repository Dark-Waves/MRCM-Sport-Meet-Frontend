import React from "react";
import { useEffect } from "react";
// import Aos from "aos";
import "./Home.css";
import Header from "./components/Header/Header";
import Hero from "./components/UI/Hero";
import Exercises from "./components/UI/Exercises";
import Start from "./components/UI/Start";
import Pricing from "./components/UI/Pricing";
import Testimonials from "./components/UI/Testimonials";
import Footer from "./components/UI/Footer";

export default function Home() {
  // useEffect(() => {
  //   Aos.init();
  // }, []);
  return (
    <div className="home">
    <>
      <Header />
      <Hero />
      <Exercises />
      <Start />
      <Pricing />
      <Testimonials />
      <Footer />
    </>
    </div>
  );
}
