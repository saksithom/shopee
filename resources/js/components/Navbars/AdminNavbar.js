import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown, Button, Breadcrumb } from "react-bootstrap";

import routes from "../../routes/routes.js";
import { userinfo } from "../../helpers/init_vars.js";
import { menuActived } from "../../helpers/functions.js";

const Header = () => {
  const [user] = useState(userinfo)
  const location = useLocation();
  const navigate = useNavigate()
  const [prevlocation, setPrevlocation] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [itemroutes, setItemroutes] = useState(routes)
  const mountActived = useRef(false)
    useEffect(() => {
      // if(!mountActived.current){
          // console.log('navbar itemroutes: ', routes)
      if(JSON.stringify(location) != JSON.stringify(prevlocation)){
        setLoaded(false)
        setActivedmenu(routes)
        setPrevlocation(location)
        setLoaded(true)
      }

      return (() => {
        mountActived.current = true
      })
    },[location])
  
  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };
  
  const setActivedmenu = (itemroute) => {
    const activedMenu = menuActived(itemroute)
    setItemroutes(activedMenu)

  }

  const getBrandText = () => {
    let bc = []
 //  console.log('actived menu : ', itemroutes)
    if(!itemroutes) return 'Brand';
    const activedRoute = itemroutes.find(x => x.actived == true)
    if(activedRoute)
    {
      bc.push(activedRoute)
      if(activedRoute.submenu)
      {
        const submenu = activedRoute.submenu.filter(x => x.actived == true)
        for(let i = 0; i < submenu.length; i++)
        {
          bc.push(submenu[i])
        }
        /*
        if(submenu)
        {
          if(submenu.activedPath)
          {
            const activedPath = activedRoute.submenu.find(x => x.path == submenu.activedPath)
            if(activedPath)
              bc.push(activedPath)
          }

          bc.push(submenu)
        }
        */
      }
      const breadcrumbs = Array.from(
        new Map(bc.map(item => [item.path,item])).values()
      );
   //  console.log('bc response : ', bc)
      const breadactive = (idx) => {
        const no = Number(idx)+1
        return no == breadcrumbs.length ? true : false
      }
      return (
          <Breadcrumb>
                <Breadcrumb.Item href={`/admin/dashboard`}>Dashboard</Breadcrumb.Item>
              {breadcrumbs?.map((menu,i) => (
                <Breadcrumb.Item key={i} active={breadactive(i)} href={breadactive(i) ? '#': `/admin${menu.path}`}>{menu.name}</Breadcrumb.Item>
              ))}
          </Breadcrumb>
      )
    }
    
    return "Dashboard";
  };
  return (
    <Navbar bg="light" expand="lg" className="bg-body-tertiary">
      {loaded &&
      <Container fluid>
      <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
          <Button
            variant="dark"
            className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
            onClick={mobileSidebarToggle}
          >
            <i className="fas fa-ellipsis-v"></i>
          </Button>
          <Navbar.Brand
            href="/admin/dashboard"
            onClick={(e) => e.preventDefault()}
            className="mr-2"
          >
            
          </Navbar.Brand>
        </div>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="mr-2">
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
        </Navbar.Toggle>

        <Navbar.Collapse className="justify-content-start">
          <Nav className="d-flex justify-content-start" navbar>
            {getBrandText()}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Nav className="d-flex justify-content-end" navbar>
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle
                  aria-expanded={false}
                  aria-haspopup={true}
                  as={Nav.Link}
                  data-toggle="dropdown"
                  id="navbarDropdownMenuLink"
                  variant="default"
                  className="m-0"
                >
                  <span className="no-icon text-primary text-bold"><i className="nc-icon nc-circle-09"></i> {user.name}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                  <Dropdown.Item
                    href="/admin/profile"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/admin/profile')
                    }}
                  >
                    โปรไฟล์
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="/admin/change-password"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/admin/change-password')
                    }}
                  >
                    เปลี่ยนรหัสผ่าน
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="/admin/logout"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/admin/logout')
                    }}
                  >
                    ออกจากระบบ
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
        </Navbar.Collapse>
      </Container>
    }
    </Navbar>
  );
}

export default Header;
