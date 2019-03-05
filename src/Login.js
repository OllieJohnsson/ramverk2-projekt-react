import React, { Component } from 'react';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };

        this.login = this.login.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }


    login(event) {
        event.preventDefault();
        fetch("https://proj-api.olliej.me/login", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then(res => res.json())
        .then(obj => {
            console.log(obj);
            this.props.handleReceivedToken(obj.token, obj.message);
        })
    };


    handleInputChange(event) {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        });
    }


    render() { 
        return (
           <div>
               <h1>Logga in</h1>
               <form onSubmit={this.login}>
                    <input name="username" placeholder="Användarnamn" type="text" required value={this.state.username} onChange={this.handleInputChange}></input>
                    <input name="password" placeholder="Lösenord" type="password" required value={this.state.password} onChange={this.handleInputChange}></input>
                    <input type="submit" value="Logga in"></input>
               </form>
           </div>
       );
    }
}


export default Login;
