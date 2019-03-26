import React, { Component } from "react";
import { LinkContainer } from 'react-router-bootstrap';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
// import NavDropdown from 'react-bootstrap/NavDropdown';


class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
        this.toggleExpanded = this.toggleExpanded.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    toggleExpanded() {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    handleLogout(event) {
        event.preventDefault();
        this.toggleExpanded();
        this.props.logout();
    }

    render() {
        const homeButton = <LinkContainer exact to="/"><Nav.Link onClick={this.toggleExpanded}>Hem</Nav.Link></LinkContainer>;
        const loginLogoutButton = this.props.token ? <LinkContainer to="/logga-in"><Nav.Link onClick={this.handleLogout}>Logga ut</Nav.Link></LinkContainer> : <LinkContainer to="/logga-in"><Nav.Link onClick={this.toggleExpanded}>Logga in</Nav.Link></LinkContainer>
        const registerButton = !this.props.token ? <LinkContainer to="/registrera"><Nav.Link onClick={this.toggleExpanded}>Registrera</Nav.Link></LinkContainer> : null;
        const objectsButton = this.props.token ? <LinkContainer to="/objekt"><Nav.Link onClick={this.toggleExpanded}>Objekt</Nav.Link></LinkContainer> : null;
        const depotButton = this.props.token ? <LinkContainer to="/depå"><Nav.Link onClick={this.toggleExpanded}>Depå</Nav.Link></LinkContainer> : null;
        const stockButton = this.props.token ? <LinkContainer to="/priser"><Nav.Link onClick={this.toggleExpanded}>Priser</Nav.Link></LinkContainer> : null;

        return (
                <Navbar expand="lg" fixed="top" onToggle={this.toggleExpanded} expanded={this.state.expanded}>
                    <Navbar.Brand href="#home"></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            {homeButton}
                            {objectsButton}
                            {depotButton}
                            {stockButton}
                            {registerButton}
                            {loginLogoutButton}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
        );
    }
}

export default Menu;
