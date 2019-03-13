import React, {Component} from "react";
import Message from "./Message";

class Depot extends Component {

    constructor(props) {
        super(props);

        this.state = {
            balance: 0,
            deposition: 0,
            myObjects: "",
            selected: null
        }
        this.fetchDepot = this.fetchDepot.bind(this);
        this.fetchBoughtObjects = this.fetchBoughtObjects.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDeposit = this.handleDeposit.bind(this);
        this.showSell = this.showSell.bind(this);
        this.handleSell = this.handleSell.bind(this);
    }

    fetchDepot() {
        fetch("https://proj-api.olliej.me/user/depot", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.props.token
            },
            body: JSON.stringify({userId: this.props.userId})
        })
        .then(res => res.json())
        .then(obj => {
            if (obj.errors) {
                console.log("err");
                console.log(obj);
                this.setState({errorMessage: obj.errors[0].detail});
                return;
            }
            console.log(obj);
            this.setState(obj);
        })
    };


    fetchBoughtObjects() {
        this.setState({numberOfObjects: 0});
        fetch("https://proj-api.olliej.me/user/boughtObjects", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.props.token
            },
            body: JSON.stringify({userId: this.props.userId})
        })
        .then(res => res.json())
        .then(obj => {
            console.log(obj);
            this.setState({myObjects: JSON.stringify(obj)});
        })
    }


    componentWillMount() {
        this.fetchDepot();
        this.fetchBoughtObjects();
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: parseInt(event.target.value)
        });
    }

    handleDeposit(event) {
        event.preventDefault();
        fetch("https://proj-api.olliej.me/user/deposit", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.props.token
            },
            body: JSON.stringify({
                userId: this.props.userId,
                amount: this.state.deposition
            })
        })
        .then(res => res.json())
        .then(obj => {
            this.setState({message: obj.message});
            this.fetchDepot();
        })
    }

    showSell(event) {
        event.preventDefault();
        this.setState({
            selected: parseInt(event.target.id),
            amount: 1,
            errorMessage: null,
            message: null
        });
    }


    handleSell(event) {
        event.preventDefault();
        fetch("https://proj-api.olliej.me/user/sell", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.props.token
            },
            body: JSON.stringify({
                userId: this.props.userId,
                objectId: this.state.selected,
                amount: this.state.amount
            })
        })
        .then(res => res.json())
        .then((obj) => {
            console.log(obj);
            if (obj.errors) {
                return this.setState({
                    errorMessage: obj.errors[0].detail,
                    message: null
                });
            }
            this.setState({
                errorMessage: null,
                message: obj.message
            });
            this.fetchDepot();
            this.fetchBoughtObjects();
        })
    }

    render() {
        console.log(this.state);
        let message = this.state.errorMessage || this.state.message ?
            <Message errorMessage={this.state.errorMessage} message={this.state.message} />
             : null;

        let objects = this.state.myObjects ? JSON.parse(this.state.myObjects) : [];
        let myObjects = objects.map(object => {
            let sellArea = this.state.selected === object.id ?
                <div className="sellArea">
                    <form onSubmit={this.handleSell}>
                        <input type="number" value={this.state.amount} name="amount" placeholder="Antal" autoComplete="off" onChange={this.handleInputChange}></input>
                        <input type="submit" value="Sälj"></input>
                    </form>
                    {message}
                </div>
                : null;
            let showSellButton = this.state.selected !== object.id ? <button id={object.id} onClick={this.showSell}>Sälj</button> : null;
            return (
                <div key={object.id}>
                    <h2>{object.name}</h2>
                    <p>Antal: {object.amount}st</p>
                    <p>Värde: {object.value.toFixed(2)}kr</p>
                    {showSellButton}
                    {sellArea}
                </div>
            );
        })

        let noObjectsMessage = objects.length < 1 ? "Du har inga köpta objekt..." : null;

        return (
            <main>
                <h1>Depå</h1>
                <p>Användare: {this.state.username}</p>
                <p>Summa: {this.state.balance.toFixed(2)}kr</p>


                <form onSubmit={this.handleDeposit}>
                    <input type="number" name="deposition" value={this.state.deposition} onChange={this.handleInputChange}></input>
                    <input type="submit" value="Sätt in"></input>
                </form>
                {message}

                <h1>Mina objekt</h1>
                {myObjects}
                {noObjectsMessage}
            </main>
        );
    }
}

export default Depot;
