import React, { Component } from 'react';
import { Router, Route } from "react-router-dom";
import history from './history';

// import Navbar from 'react-bootstrap/Navbar';
// import Nav from 'react-bootstrap/Nav';

// import NavDropdown from 'react-bootstrap/NavDropdown';
// import { LinkContainer } from 'react-router-bootstrap';

// import history from './history'

// import './style/App.css';
// import './style/Home.css';
// import './style/Report.css';


import Menu from './Menu';
import Home from './Home';
import Register from './Register';
import Login from './Login';
// import Report from './sites/Report.js';
// import AddReport from './sites/AddReport.js';
// import Login from './sites/Login.js';
// import Chat from './sites/Chat.js';



class App extends Component {
    constructor(props) {
        super(props);

        let localToken = localStorage.getItem('token');
        this.state = {
            token: localToken != "undefined" ? JSON.parse(localToken) : null
        };

        this.handleReceivedToken = this.handleReceivedToken.bind(this);
        this.logout = this.logout.bind(this);
    }

    handleReceivedToken(token, message) {
        this.setState({
            token: token
        }, () => {
            localStorage.setItem('token', JSON.stringify(this.state.token));
        });
        history.push("/");
        console.log(message);
    }

    componentDidMount() {
        this.checkToken();
    }

    checkToken() {
        fetch('https://proj-api.olliej.me/checkToken', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            },
        }).then((res) => {
            if (res.status != 200) {
                this.setState({
                    token: null
                });
            }
        });
    }


    logout() {
        this.setState({
            token: null
        }, () => {
            localStorage.removeItem('token');
        });
    }


    render() {
        console.log(this.state);
        return (
            <Router history={history}>
                <div className="App">
                    <Menu token={this.state.token} logout={this.logout}></Menu>

                    <Route exact path="/" component={Home} />
                    <Route exact path="/registrera" render={(props) => <Register {...props} handleReceivedToken={this.handleReceivedToken} />} />
                    <Route exact path="/logga-in" render={(props) => <Login {...props} handleReceivedToken={this.handleReceivedToken} />} />
                </div>
            </Router>
        );
    }
}



// const loginLogoutButton = this.state.isLoggedIn ? <LinkContainer to="/logga-ut"><Nav.Link onClick={this.logout}>Logga ut</Nav.Link></LinkContainer> : <LinkContainer to="/logga-in"><Nav.Link>Logga in</Nav.Link></LinkContainer>
// const addReportButton = this.state.isLoggedIn ? <LinkContainer to="/add/reports"><Nav.Link>Lägg till</Nav.Link></LinkContainer> : null;
//
// const registerButton = !this.state.isLoggedIn ? <LinkContainer to="/registrera"><Nav.Link>Registrera</Nav.Link></LinkContainer> : null;



// return (
//     <Router history={history}>
//     <div className="App">
//
//     <Navbar expand="lg">
//     <Navbar.Brand href="#home"></Navbar.Brand>
//     <Navbar.Toggle aria-controls="basic-navbar-nav" />
//     <Navbar.Collapse id="basic-navbar-nav">
//     <Nav className="mr-auto">
//
//     <LinkContainer to="/">
//     <Nav.Link>Hem</Nav.Link>
//     </LinkContainer>
//
//     <NavDropdown title="Redovisningar" id="basic-nav-dropdown">
//
//     </NavDropdown>
//
//     {registerButton}
//
//     {addReportButton}
//     {loginLogoutButton}
//
//     <LinkContainer to="/chat">
//     <Nav.Link>Chat</Nav.Link>
//     </LinkContainer>
//     <Route exact path="/" component={Home} />
//     <Route exact path="/registrera" component={Register} />
//     <Route exact path="/logga-in" component={Login} />
//     </Nav>
//     </Navbar.Collapse>
//     </Navbar>
//
//     </div>
//     </Router>
// );


// <Route exact path="/" component={Home} />
// <Route path="/reports/:kmom" component={Report} />
// <Route path="/add/reports" render={(props) => <AddReport {...props} token={this.state.token} kmoms={this.state.kmoms} />} />
// <Route path="/login" render={(props) => <Login {...props} onTokenReceived={this.handleReceivedToken} />} />
// <Route path="/chat" component={Chat} />


// const kmomButtons = this.state.kmoms.map(kmom => {
//     return(
//         <LinkContainer to={`/reports/${kmom}`} key={kmom}>
//         <NavDropdown.Item>{kmom[0].toUpperCase() + kmom.slice(1)}</NavDropdown.Item>
//         </LinkContainer>
//     );
// });

export default App;
