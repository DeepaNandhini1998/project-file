import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Details/Register";
import Login from "./Details/Login";
import Dashboard from "./Details/Dashboard";
import Advertisement from "./Details/Advertisement.js"
import { Contact } from "./Details/Contact";

function Mail () {
  return (
    <div className="Mail">
      <Advertisement/>
      <Router>
        <Routes>
          <Route element={<Register />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<Dashboard />} path="/dashboard" />
          <Route  element={<Contact />} path="/contact" />
        </Routes>
      </Router>
      <Advertisement/>
    </div>
  );
}
