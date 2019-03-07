import React, { Component } from 'react';
import Message from "./Message";


class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            passwordCheck: "",
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.register = this.register.bind(this);
    }


    register(event) {
        event.preventDefault();
        if (this.state.password !== this.state.passwordCheck) {
            return this.setState({
                errorMessage: "Du måste skriva in samma lösenord"
            });
        }

        fetch("https://proj-api.olliej.me/register", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then(res => res.json())
        .then(obj => {
            if (obj.errors) {
                return this.setState({
                    errorMessage: obj.errors[0].detail
                });
            }
            this.props.handleReceivedToken(obj.token, obj.userId, obj.message);
        })
    };



    handleInputChange(event) {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        })
    }


    componentDidMount() {
        document.getElementsByTagName("input")[0].focus();
    }


    render() { 
        const message = this.state.errorMessage ? <Message errorMessage={this.state.errorMessage} /> : null;
        return (
           <main>
               <h1>Registrera</h1>
                <form onSubmit={this.register}>
                    <input name="username" placeholder="Användarnamn" type="text" required value={this.state.username} onChange={this.handleInputChange}></input>
                    <input name="email" placeholder="E-post" type="email" required value={this.state.email} onChange={this.handleInputChange}></input>
                    <input name="firstName" placeholder="Förnamn" type="text" required value={this.state.firstName} onChange={this.handleInputChange}></input>
                    <input name="lastName" placeholder="Efternamn" type="text" required value={this.state.lastName} onChange={this.handleInputChange}></input>
                    <input name="password" placeholder="Lösenord" type="password" required value={this.state.password} onChange={this.handleInputChange}></input>
                    <input name="passwordCheck" placeholder="Upprepa lösenord" type="password" required value={this.state.passwordCheck} onChange={this.handleInputChange}></input>
                    <input type="submit" value="Registrera"></input>
                </form>
                {message}
        </main>
       );
    }
}


export default Register;
