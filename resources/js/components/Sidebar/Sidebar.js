import React, { Component, useEffect, useRef, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";

import { Collapse, Nav } from "react-bootstrap";

import logo from "../../assets/img/shop-logo.png";
import { menuActived } from "../../helpers/functions";

const Sidebar = ({ color, image, routes }) => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState({});
  const [itemroutes, setItemroutes] = useState(routes)
  const [prelocation, setPrelocation] = useState([])
  const [loaded, setLoaded] = useState(false)
  const mountActived = useRef(false)
  useEffect(() => {
    // console.log('location: ', location)
    if(JSON.stringify(location) !== JSON.stringify(prelocation)){
      setActivedmenu()
      setPrelocation(location)
    }
    // if(!mountActived.current)
    // setActivedmenu()
    return (() => {
      mountActived.current = true
    })
  },[itemroutes,location])

  // ฟังก์ชันสำหรับสลับสถานะเปิด/ปิดเมนู
  const toggleMenu = (key) => {
    setOpenSubmenu((prev) => ({
      ...prev,
      [key]: !prev[key], // Toggle the state of the clicked submenu
    }));
  };

  const setActivedmenu = () => {
    // console.log('set actived menu')
    const activedMenu = menuActived(itemroutes)
    setItemroutes(activedMenu)
  }

  const actived = (item) => {
      if(item.submenu && item.submenu.length > 0){
     //  console.log('item submenu : ', item.submenu)
          const at = item.submenu.find(x => x.actived == true)
          return at ? 'active show': ''
      }else{
        return item.actived ? 'active' : ''
      }
  }

  const isOpen = (key) => !!openSubmenu[key];

  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
        style={{
          backgroundImage: "url(" + image + ")"
        }}
      />
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start">
          <a
            href="/admin/dashboard"
            className="simple-text logo-mini mx-1"
          >
            <div className="logo-img">
              <img src={logo} alt="..." />
            </div>
          </a>
          <a className="simple-text" href="/admin/dashboard">
            Affiliates
          </a>
        </div>
        <Nav>
      {itemroutes.map((prop, key) => (
        <React.Fragment key={key}>
          {prop.sidebar && (
            <>
              {(prop.submenu && prop.submenu.length > 0) ?
                <>
                  <Nav.Item className={`nav-item ${actived(prop)}`}>
                    <NavLink
                      onClick={(e) => {
                        e.preventDefault();
                        toggleMenu(key);
                      }}
                      className={`nav-link ${actived(prop)}`}
                    >
                      <i className={prop.icon} />
                      <p>{prop.name}</p>
                    </NavLink>
                    <Collapse in={isOpen(key)}>
                      <Nav className={`mt-0 submenu ${actived(prop)}`}>
                        {prop.submenu.map((sub, idx) => (
                          <React.Fragment key={idx}>
                          {sub.sidebar && (
                            <Nav.Item
                              key={idx}
                              className={`${actived(sub)} ${!sub.sidebar ? 'hidden' : ''}`}
                            >
                              <NavLink
                                to={sub.layout + sub.path}
                                className={`nav-link ${actived(sub)}`}
                                >
                                <i className={sub.icon} />
                                <p>{sub.name}</p>
                              </NavLink>
                            </Nav.Item>
                          )}
                          </React.Fragment>
                        ))}
                      </Nav>
                    </Collapse>
                  </Nav.Item>
                </>
               : 
                <Nav.Item
                  className={`${prop.upgrade ? "active-pro" : actived(prop)}`}
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className={`nav-link ${actived(prop)}`}
                  >
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </Nav.Item>
              }
            </>
          )}
        </React.Fragment>
      ))}
    </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
