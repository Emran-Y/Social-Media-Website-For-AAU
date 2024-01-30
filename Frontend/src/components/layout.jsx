import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header/header";
import Footer from "../pages/Footer/Footer";
import { useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();
  const [footerDisplay, setFooterDisplay] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (location.pathname === "/myclubs" && window.innerWidth < 1000) {
        setFooterDisplay(false);
      } else {
        setFooterDisplay(true);
      }
    };

    handleResize(); // Initial call to set state based on current window size

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [location.pathname, window.innerWidth]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <Outlet />
      <div style={{ flex: "1" }}>
        {/* This div ensures that the content takes up remaining space */}
        {/* Remove this div if you want the footer to overlay the content */}
      </div>
      {footerDisplay && <Footer style={{ position: "relative" }} />}
    </div>
  );
}

export default Layout;
