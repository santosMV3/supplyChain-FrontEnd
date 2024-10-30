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
import NotifyComponent, { showNotify } from "../components/notifications/notify";

function Admin({...props}) {
  const [sidenavOpen, setSidenavOpen] = React.useState(true);
  const [pageState, setPageState] = useState([]);
  const location = useLocation();
  const mainContentRef = React.useRef(null);
  const notifyRef = React.useRef(null);
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

  const getPagePermissions = async () => {
    try {
      const responses = await Promise.all([
        api.get(`user-permission?idUser=${localStorage.getItem("AUTHOR_ID")}`),
        api.get(`/users/${localStorage.getItem("AUTHOR_ID")}`),
        api.get("/pages"),
        api.get("/permissions/")
      ]);
      
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
        const permissionId = responses[0].data[0].idPermission;
        const permission = responses[3].data.find((permission) => permission.idPermission === permissionId);
  
        responses[2].data.forEach((page) => {
          if (permission.idPages.indexOf(page.idPage) > -1){
            pagesAllowed.push(page.name);
          }
        });
  
          setPageState(pagesAllowed);
      }
    } catch (error) {
      console.error(error);
      window.alert("An error occurred while trying to collect your permissions.");
      localStorage.clear();
      history.push("/auth/login");
    }
  }

  const verifyNextDaysExpiration = (expirationDate, daysToExpire=7) => {
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + daysToExpire);
    const diffTime = next7Days - expirationDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if ((diffDays >= 0) && (diffDays <= daysToExpire)) {
      return `Your password will expire in ${diffDays} days.`
    }
    return false;
  };

  const passExpiredVerify = async () => {
    try {
      const response = await api.get("/api-token-verify");
      if (response.data.password_expired) return history.push("/auth/reset");
      console.log(verifyNextDaysExpiration(new Date(response.data.password_expire_date)))

      const expirationStatus = verifyNextDaysExpiration(new Date(response.data.password_expire_date));

      if (expirationStatus) showNotify(notifyRef, "Warning", expirationStatus, "warning");
    } catch (error) {
      console.error(error);
    }
  }

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
  }, [location]);

  React.useEffect(() => {
    Promise.all([
      getPagePermissions(),
      passExpiredVerify()
    ]);
  }, [])

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }

      if (prop.layout === "/admin") {
        if(pageState.indexOf(prop.name.toLowerCase()) === -1) return (
          <Route
            path={prop.layout + prop.path}
            render={() => <Unauthorized/>}
            key={key}
          />
        );

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
      <NotifyComponent notifyRef={notifyRef}/>
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
