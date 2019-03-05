import React, { Component } from "react";
import { Route } from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import Home from './Home';
import Register from './Register';
import Login from './Login';

class Menu extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const loginLogoutButton = this.props.token ? <LinkContainer to="/logga-ut"><Nav.Link onClick={this.props.logout}>Logga ut</Nav.Link></LinkContainer> : <LinkContainer to="/logga-in"><Nav.Link>Logga in</Nav.Link></LinkContainer>
        const registerButton = !this.props.token ? <LinkContainer to="/registrera"><Nav.Link>Registrera</Nav.Link></LinkContainer> : null;
        return (
                <Navbar expand="lg">
                    <Navbar.Brand href="#home"></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">

                            <LinkContainer to="/">
                                <Nav.Link>Hem</Nav.Link>
                            </LinkContainer>

                            {registerButton}
                            {loginLogoutButton}

                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
        );
    }
}

export default Menu;
