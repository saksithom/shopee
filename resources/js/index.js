/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap"
import "./assets/css/animate.min.css";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import AdminLayout from "./layouts/Admin.js";
import Login from "./views/Auth/Login"
import LoginLayout from "./layouts/Login";
import BackendRoutes from "./routes/routes";
import AuthMiddleware from "./middleware/authen";
import Profile from "./views/Auth/profile";
import Changepassword from "./views/Auth/password";
import PolicyPage from "./views/policy/policy";
import TermsOfService from "./views/policy/termofservice";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// dayjs.extend(utc)
// dayjs.extend(timezone)
// dayjs.tz.setDefault('Asia/Bangkok')
const root = ReactDOM.createRoot(document.getElementById("app"));

const getRoutes = (routes) => {
  return routes.map((prop, key) => {
    if (prop.layout === "/admin") {
      // สร้าง Route สำหรับเมนูหลัก
      const mainRoute = (
        <Route
          path={prop.layout + prop.path}
          element={<AuthMiddleware><AdminLayout><prop.component /></AdminLayout></AuthMiddleware>}
          key={key}
        />
      );

      // หากเมนูมี submenu ให้เรนเดอร์ Subroutes
      if (prop.submenu) {
        const subRoutes = prop.submenu.map((subProp, subKey) => {
          return (
            <Route
              path={prop.layout + subProp.path}
              element={<AuthMiddleware><AdminLayout><subProp.component /></AdminLayout></AuthMiddleware>}
              key={subKey}
            />
          );
        });
        
        // รวม Route หลักและ Subroutes
        return (
          <React.Fragment key={key}>
            {mainRoute}
            {subRoutes}
          </React.Fragment>
        );
      }

      return mainRoute; // ถ้าไม่มี submenu ให้แค่แสดง Route หลัก
    } else {
      return null; // หากไม่ใช่ layout /admin ให้คืนค่า null
    }
  });
};
root.render(
  <>
  <Router>
    <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/login" element={<LoginLayout><Login/></LoginLayout>} />
        {getRoutes(BackendRoutes)}
        <Route path="/admin/profile" element={<AuthMiddleware><AdminLayout><Profile /></AdminLayout></AuthMiddleware>} />
        <Route path="/admin/change-password" element={<AuthMiddleware><AdminLayout><Changepassword /></AdminLayout></AuthMiddleware>} />
        <Route path="/private-policy" element={<PolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
  </Router>
  </>
);
