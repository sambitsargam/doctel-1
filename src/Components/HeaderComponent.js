import React, { Component } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavbarToggler,
  Collapse,
  NavItem,
} from "reactstrap";
import { NavLink } from "react-router-dom";

import "../App.css";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { isNavOpen: false };
    this.togglenav = this.togglenav.bind(this);
  }

  togglenav() {
    this.setState({ isNavOpen: !this.state.isNavOpen });
  }

  render() {
    return (
      <React.Fragment>
        <Navbar dark expand="md">
          <div className="container justify-center">
            <NavbarToggler onClick={this.togglenav} />
            <NavbarBrand className="mr-auto">DOCTEL</NavbarBrand>
            <Collapse isOpen={this.state.isNavOpen} navbar>
              <Nav navbar>
                <NavItem>
                  <NavLink className="nav-link" to="/home">
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link" to="/signup">
                    Register
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link" to="/members">
                    Members
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link" to="/patient">
                    Patient
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link" to="/patdata">
                    Patient Data
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link" to="/treatment">
                    Treatment
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link" to="/treat">
                    All Treatment
                  </NavLink>
                </NavItem>
              </Nav>
              <p
                className="right-align"
                style={{ float: "right", color: "white" }}
              >
                {localStorage.getItem("myAadhar") != 0
                  ? `Logged in: ${localStorage.getItem("myAadhar")}`
                  : "Not Logged in"}
                <br />
                <small>
                  {localStorage.getItem("wallet") != 0
                    ? `Wallet: ${localStorage.getItem("wallet")}`
                    : "Not Connected"}
                </small>
              </p>
            </Collapse>
          </div>
        </Navbar>
      </React.Fragment>
    );
  }
}

export default Header;
