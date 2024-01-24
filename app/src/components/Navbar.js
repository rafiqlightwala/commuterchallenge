import React from "react";
import "./Navbar.css"; // Import the CSS file
import Englishf from './english-flag.png'; 

const NavBar = () => {
  const sections = [
    "HOME",
    "ABOUT",
    "GET INVOLVED",
    "RESOURCES",
    "RESULTS",
    "CITY CONTACT",
  ];

  return (
    <nav>
      <ul>
        {sections.map((section, index) => (
          <li key={index}>{section}</li>
        ))}
        <li className="flag">
          <img src={Englishf} alt="English Flag" />
          <span>English</span>
        </li>
        <li className="flag">
          <img src="/french-flag.png" alt="French Flag" />
          <span>French</span>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
