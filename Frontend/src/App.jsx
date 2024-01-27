import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import home from "./pages/home/home";
import login from "./pages/login/login";
import signup from "./pages/signup/signup";

function App() {
  return (
    <div className="app">
      <Route path="/" component={home} exact />
      <Route path="/login" component={login} />
      <Route path="/signup" component={signup} />
    </div>
  );
}

export default App;
