import React, { Component, useEffect, useRef, useState } from "react";
import { useLocation, Route, Routes, Outlet } from "react-router-dom";

import AdminNavbar from "../components/Navbars/AdminNavbar";
import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sidebar/Sidebar";
import FixedPlugin from "../components/FixedPlugin/FixedPlugin.js";

import BackendRoutes from "../routes/routes.js";

import sidebarImage from "../assets/img/sidebar-2.jpg";
import 'react-bootstrap'
import { Context } from "../helpers/init_vars";
import { menuActived } from "../helpers/functions";
const Admin = ({children}) => {
  const [image, setImage] = useState(sidebarImage);
  const [color, setColor] = useState("orange");
  const [hasImage, setHasImage] = useState(true);
  const location = useLocation();
  const mainPanel = useRef(null);
  
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      var element = document.getElementById("bodyClick");
      element.parentNode.removeChild(element);
    }
  }, [location]);
  return (
    <>
      <div className="wrapper">
        <Sidebar color={color} image={hasImage ? image : ""} routes={BackendRoutes} />
        <div className="main-panel" ref={mainPanel}>
          <AdminNavbar routes={BackendRoutes} />
          <div className="content">
            {children}
          </div>
          <Footer />
        </div>
      </div>
      <FixedPlugin
        hasImage={hasImage}
        setHasImage={() => setHasImage(!hasImage)}
        color={color}
        setColor={(color) => setColor(color)}
        image={image}
        setImage={(image) => setImage(image)}
      />
    </>
  );
}

export default Admin;
