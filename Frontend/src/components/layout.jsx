import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./header/header";

function Layout() {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <Header />

      <Outlet />
    </div>
  );
}

export default Layout;
