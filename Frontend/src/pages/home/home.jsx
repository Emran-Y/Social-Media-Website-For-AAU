import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  if (!localStorage.getItem("userData")) {
    navigate("/login");
  }
  return <div>home</div>;
}

export default Home;
