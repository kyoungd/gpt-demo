import React, { useState, useEffect } from "react";
import { Contact } from "./components/contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import NoSafari from './components/no-safari';
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

// browserDetection.js

export function isSafariBrowser() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <div>
      { isSafariBrowser() ? <NoSafari /> : <Contact data={landingPageData.Contact} /> }
    </div>
  );
};

export default App;
