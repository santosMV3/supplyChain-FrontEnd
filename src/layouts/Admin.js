/*!

=========================================================
* Argon Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState } from "react";
// react library for routing
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
import {isSignedIn} from "../services/security";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
// import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import {api} from "../services/api";
import { useHistory } from "react-router-dom";
import routes from "routes.js";

function Admin() {
  const [sidenavOpen, setSidenavOpen] = React.useState(true);
  const [pageState, setPageState] = useState([])
  const location = useLocation();
  const mainContentRef = React.useRef(null);
  const history = useHistory();

  if(isSignedIn()){
    const date = new Date().toISOString()
    api.patch(`/users/${localStorage.getItem('AUTHOR_ID')}/`, {last_login: date}).catch((error) => {
      if(error.response){
        const detail = error.response.data.detail
        if(detail === "Token inválido.") {
          localStorage.clear();
          return history.push('/auth/login');
        }
        return console.log(detail);
      }
      return console.log(error);
    });
  }else{
    history.push('/auth/login');
  }

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
  }, [location]);
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if(pageState.indexOf(prop.name) > -1) return null;
      api.get(`user-permission?idUser=${localStorage.getItem("AUTHOR_ID")}`).then((response) => {
        if(response.data.length === 0) {
          api.get(`/users/${localStorage.getItem("AUTHOR_ID")}`).then((response) => {
            if(!(response.data.is_superuser)) {
              localStorage.clear();
              history.push('/auth/login');
            };
          }).catch(console.error)
        } else {
          api.get(`/permissions/${response.data[0].idPermission}`).then((response) => {
            let permissions = response.data;
            api.get(`/pages?name=${prop.name.toLowerCase()}`).then((responsePage => {
              if(responsePage.data.length < 1){
                // console.log(prop.name);
                let page = pageState;
                page.push(prop.name);
                setPageState(page);
              } else {
                // console.log(responsePage.data[0].idPage);
                if(permissions.idPages.indexOf(responsePage.data[0].idPage) === -1){
                  let page = pageState;
                  page.push(prop.name);
                  setPageState(page);
                }
              }
            })).catch(console.error);
          }).catch(console.error);
        }
      }).catch(console.error);
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  // toggles collapse between mini sidenav and normal
  const toggleSidenav = (e) => {
    if (document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
    } else {
      document.body.classList.add("g-sidenav-pinned");
      document.body.classList.remove("g-sidenav-hidden");
    }
    setSidenavOpen(!sidenavOpen);
  };
  const getNavbarTheme = () => {
    return location.pathname.indexOf("admin/alternative-dashboard") === -1
      ? "dark"
      : "light";
  };

  return (
    <>
      <Sidebar
        routes={routes}
        toggleSidenav={toggleSidenav}
        sidenavOpen={sidenavOpen}
        logo={{
          innerLink: "/admin/dashboard",
          imgSrc: require("assets/img/brand/EndressLogoGo.png").default,
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContentRef}>
        <AdminNavbar
          theme={getNavbarTheme()}
          toggleSidenav={toggleSidenav}
          sidenavOpen={sidenavOpen}
          brandText={getBrandText(location.pathname)}
        />
        <Switch>
          {getRoutes(routes)}
          <Redirect from="*" to="/admin/dashboard" />
        </Switch>
      </div>
      {sidenavOpen ? (
        <div className="backdrop d-xl-none" onClick={toggleSidenav} />
      ) : null}
    </>
  );
}

export default Admin;
