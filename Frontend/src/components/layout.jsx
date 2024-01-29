import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./header/header";
import Footer from "../pages/Footer/Footer";

function Layout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
