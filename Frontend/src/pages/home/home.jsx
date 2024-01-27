import React from "react";
import { useHistory } from "react-router-dom";

function home() {
  const history = useHistory();
  if (!localStorage.getItem("userData")) {
    history.push("/login");
  }
  return <div>home</div>;
}

export default home;
