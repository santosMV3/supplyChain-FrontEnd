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
import Unauthorized from "./components/unauthorized";

function Admin() {
  const [sidenavOpen, setSidenavOpen] = React.useState(true);
  const [pageState, setPageState] = useState([]);
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
        return console.info(detail);
      }
      return console.error(error);
    });
  }else{
    history.push('/auth/login');
  }

  const getPagePermissions = () => {
    Promise.all([
      api.get(`user-permission?idUser=${localStorage.getItem("AUTHOR_ID")}`),
      api.get(`/users/${localStorage.getItem("AUTHOR_ID")}`),
      api.get("/pages")
    ]).then((responses) => {
      if ((responses[0].data.length === 0) && !(responses[1].data.is_superuser)) {
        localStorage.clear();
        history.push("/auth/login");
      }

      let pagesAllowed = [];
      if(responses[1].data.is_superuser) {
        const pageNames = responses[2].data.map((page) => page.name);
        pagesAllowed = pagesAllowed.concat(pageNames);
        return setPageState(pagesAllowed);
      } else {
        api.get(`/permissions/${responses[0].data[0].idPermission}`).then((permission) => {

          responses[2].data.forEach((page) => {
            if (permission.data.idPages.indexOf(page.idPage) > -1){
              pagesAllowed.push(page.name);
            }
          });
  
          setPageState(pagesAllowed);
  
        }).catch((error) => {
          console.error(error);
          window.alert("An error occurred while trying to collect your permissions. [1]");
          localStorage.clear();
          history.push("/auth/login");
        }); 
      }

    }).catch((error) => {
      console.error(error);
      window.alert("An error occurred while trying to collect your permissions. [0]");
      localStorage.clear();
      history.push("/auth/login");
    })
  }

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
  }, [location]);

  React.useEffect(() => {
    getPagePermissions();
  }, [])

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }

      if (prop.layout === "/admin") {
        if(pageState.indexOf(prop.name.toLowerCase()) === -1) return null;

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
