import React, {useEffect, useState} from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// reactstrap components
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Navbar,
  NavItem,
  Nav,
  Container,
} from "reactstrap";

import {api} from "../../services/api";
import {signOut} from "../../services/security";
import { useHistory } from 'react-router-dom';

function AdminNavbar({ theme, sidenavOpen, toggleSidenav }) {
  const [userData, setUserData] = useState([]);
  const history = useHistory();

  useEffect(() => {
    let abortController = new AbortController();
   const getUserLogedData = async () => {
      try {
        api.get(`/users/${localStorage.getItem('AUTHOR_ID')}/`).then((response) => {
          setUserData(response.data);
        }).catch(console.error);
      } catch (error) {
        console.error(error);
      }
   }

   getUserLogedData();

   return () => abortController.abort();
  }, []);


  return (
    <>
      <Navbar
        className={classnames(
          "navbar-top navbar-expand border-bottom",
          { "navbar-dark bg-info": theme === "dark" },
          { "navbar-light bg-secondary": theme === "light" }
        )}
      >
        <Container fluid>
          <Collapse navbar isOpen={true}>
            <Nav className="align-items-center ml-md-auto" navbar>
              <NavItem className="d-xl-none">
                <div
                  className={classnames(
                    "pr-3 sidenav-toggler",
                    { active: sidenavOpen },
                    { "sidenav-toggler-dark": theme === "dark" }
                  )}
                  onClick={toggleSidenav}
                >
                  <div className="sidenav-toggler-inner">
                    <i className="sidenav-toggler-line" />
                    <i className="sidenav-toggler-line" />
                    <i className="sidenav-toggler-line" />
                  </div>
                </div>
              </NavItem>
            </Nav>
            <Nav className="align-items-center ml-auto ml-md-0" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="nav-link pr-0" color="" tag="a">
                  <Media className="align-items-center">
                    <Media className="ml-2 d-none d-lg-block" style={{
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}>
                      <span className="mb-0 text-sm font-weight-bold">
                        {userData.first_name!==""?userData.first_name:userData.username}
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0" style={{textAlign: 'center'}}>Welcome!</h6>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem
                    href="#pablo"
                    onClick={(e) => {
                      e.preventDefault();
                      signOut();
                      history.push('/auth/login');
                    }}
                  >
                    <i className="ni ni-user-run" />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}

AdminNavbar.defaultProps = {
  toggleSidenav: () => {},
  sidenavOpen: false,
  theme: "dark",
};
AdminNavbar.propTypes = {
  toggleSidenav: PropTypes.func,
  sidenavOpen: PropTypes.bool,
  theme: PropTypes.oneOf(["dark", "light"]),
};

export default AdminNavbar;
