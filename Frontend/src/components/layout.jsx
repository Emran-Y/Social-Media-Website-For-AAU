import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./header/header";

function Layout() {
  return (
    <div>
      <Header />

      <Outlet />
    </div>
  );
}

export default Layout;
