import React, {Component} from "react";
import Message from "./Message";

class Depot extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            balance: 0,
            deposit: false,
            deposition: 0,
            myObjects: [],
            selected: null
        }
        this.fetchDepot = this.fetchDepot.bind(this);
        this.fetchBoughtObjects = this.fetchBoughtObjects.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDeposit = this.handleDeposit.bind(this);
        this.showSell = this.showSell.bind(this);
        this.handleSell = this.handleSell.bind(this);
        this.showDeposit = this.showDeposit.bind(this);

    }


    fetchDepot() {
        fetch(`https://proj-api.olliej.me/user/depot/${this.props.userId}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.props.token
            },
        })
        .then(res => res.json())
        .then(obj => {
            if (obj.errors) {
                this.setState({errorMessage: obj.errors[0].detail});
                return;
            }
            this.setState({
                username: obj.username,
                balance: obj.balance
            });
        })
    };


    fetchBoughtObjects() {
        this.setState({numberOfObjects: 0});
        fetch(`https://proj-api.olliej.me/user/boughtObjects/${this.props.userId}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.props.token
            }
        })
        .then(res => res.json())
        .then(objects => {
            this.setState({myObjects: objects});
        })
    }


    componentDidMount() {
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
            this.setState({
                message: obj.message,
                deposit: false,
                deposition: 0,

            });
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



    showDeposit() {
        this.setState({deposit: true});
    }

    render() {
        console.log(this.state);
        let message = this.state.errorMessage || this.state.message ?
            <Message errorMessage={this.state.errorMessage} message={this.state.message} />
             : null;

        let showDepositButton = this.state.deposit ? null : <button onClick={this.showDeposit}>Sätt in pengar</button>;
        let depositArea = this.state.deposit ? (
            <form id="depositForm" onSubmit={this.handleDeposit}>
                <label>Summa</label>
               <input type="number" name="deposition" value={this.state.deposition} onChange={this.handleInputChange}></input>
               <input type="submit" value="Sätt in pengar"></input>
           </form>
       ) : null;

        let myObjects = this.state.myObjects.map(object => {
            let sellArea = this.state.selected === object.id ?
                <div className="sellArea">
                    <form onSubmit={this.handleSell}>
                        <label>Antal</label>
                        <input type="number" value={this.state.amount} name="amount" placeholder="Antal" autoComplete="off" onChange={this.handleInputChange}></input>
                        <input type="submit" value="Sälj"></input>
                    </form>
                    {message}
                </div>
                : null;
            let showSellButton = this.state.selected !== object.id ? <button id={object.id} onClick={this.showSell}>Sälj</button> : null;
            return (
                <div key={object.id} className="object">
                    <h2>{object.name}</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td>Antal: </td>
                                <td>{object.amount}st</td>
                            </tr>
                            <tr>
                                <td>Värde: </td>
                                <td>{object.value.toFixed(2)}kr</td>
                            </tr>
                        </tbody>
                    </table>
                    {showSellButton}
                    {sellArea}
                </div>
            );
        })

        let noObjectsMessage = this.state.myObjects.length < 1 ? "Du har inga köpta objekt..." : null;


        return (

            <main>
                {message}
                <h1>Depå</h1>

                <div className="area">
                    <table>
                        <tbody>
                            <tr>
                                <td>Användare: </td>
                                <td>{this.state.username}</td>
                            </tr>
                            <tr>
                                <td>Kapital: </td>
                                <td>{this.state.balance.toFixed(2)}kr</td>
                            </tr>
                        </tbody>
                    </table>

                    {showDepositButton}
                    {depositArea}
                </div>
                <div className="area">
                    <h1>Mina objekt</h1>
                    {myObjects}
                    {noObjectsMessage}
                </div>
            </main>
        );
    }
}

export default Depot;
