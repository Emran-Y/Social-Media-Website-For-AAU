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
    <div>
      <Header />
      <Outlet />
      {footerDisplay && <Footer />}
    </div>
  );
}

export default Layout;
