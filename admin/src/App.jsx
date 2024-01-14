import React from "react";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Admin from "./pages/admin/Admin";

const App = () => {
  return (
    <div>
      <Navbar />
      <Admin />
    </div>
  );
};

export default App;
