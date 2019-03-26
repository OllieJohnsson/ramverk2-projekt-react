import React, { Component } from 'react';
import { Router, Route } from "react-router-dom";
import history from './history';

import './style/App.css';
import './style/Navigation.css';
import './style/Form.css';
import './style/Object.css';
// import './style/Home.css';
// import './style/Report.css';

import Menu from './Menu';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Objects from './Objects';
import Depot from './Depot';
import Stock from './Stock';
import Message from './Message';



class App extends Component {
    constructor(props) {
        super(props);

        let localToken = localStorage.getItem('token');
        let localUserId = localStorage.getItem('userId');
        this.state = {
            token: localToken !== "undefined" ? JSON.parse(localToken) : null,
            userId: localUserId !== "undefined" ? JSON.parse(localUserId) : null,
            success: null,
            error: null
        };

        this.handleReceivedToken = this.handleReceivedToken.bind(this);
        this.logout = this.logout.bind(this);

        this.success = this.success.bind(this);
        this.error = this.error.bind(this);
    }

    success(message) {
        this.setState({
            success: message,
            error: null
        });
        let app = this;
        setTimeout(function () {
            app.setState({
                success: null,
                error: null
            });
        }, 4000);
    }
    error(message) {
        this.setState({
            success: null,
            error: message
        });
        let app = this;
        setTimeout(function () {
            app.setState({
                success: null,
                error: null
            });
        }, 4000);
    }

    handleReceivedToken(token, userId, message) {
        this.setState({
            token: token,
            userId: userId
        }, () => {
            localStorage.setItem('token', JSON.stringify(this.state.token));
            localStorage.setItem('userId', JSON.stringify(this.state.userId));
        });
        history.push("/");
        console.log(message);
    }


    logout() {
        this.setState({
            token: null,
            userId: null
        }, () => {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
        });
        history.push("/logga-in");
    }


    render() {
        console.log(this.state);
        return (
            <Router history={history}>
                <div className="App">
                    <Menu token={this.state.token} logout={this.logout}></Menu>

                    <Message success={this.state.success} error={this.state.error}/>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/registrera" render={(props) => <Register {...props} handleReceivedToken={this.handleReceivedToken} />} />
                    <Route exact path="/logga-in" render={(props) => <Login {...props} handleReceivedToken={this.handleReceivedToken} />} />
                    <Route exact path="/objekt" render={(props) => <Objects {...props} token={this.state.token} userId={this.state.userId} logout={this.logout} success={this.success} error={this.error} />} />
                    <Route exact path="/depå" render={(props) => <Depot {...props} token={this.state.token} userId={this.state.userId} logout={this.logout} success={this.success} error={this.error} />} />
                    <Route exact path="/priser" render={(props) => <Stock {...props} token={this.state.token} userId={this.state.userId} logout={this.logout} />} />
                </div>
            </Router>
        );
    }
}


export default App;
