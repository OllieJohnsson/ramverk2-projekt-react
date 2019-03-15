import React, {Component} from "react";
import functions from "./functions";
import Choice from "./Choice";

class Depot extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            balance: 0,
            deposit: false,
            deposition: "",
            myObjects: [],
            selected: null,
            amount: 0
        }
        this.fetchDepot = this.fetchDepot.bind(this);
        this.fetchBoughtObjects = this.fetchBoughtObjects.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDeposit = this.handleDeposit.bind(this);
        this.showHideSell = this.showHideSell.bind(this);
        this.handleSell = this.handleSell.bind(this);
        this.showHideDeposit = this.showHideDeposit.bind(this);
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
                this.props.logout();
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
            [event.target.name]: parseInt(event.target.value) || ""
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
                deposit: false,
                deposition: "",
            });
            this.props.success(obj.message);
            this.fetchDepot();
        })
    }


    showHideSell(event) {
        event.preventDefault();
        let cancel = event.target.name === "cancel";
        this.setState({
            selected: cancel ? null : parseInt(event.target.id),
            amount: 1,
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
            if (obj.errors) {
                return this.props.error(obj.errors[0].detail);
            }
            this.props.success(obj.message);
            this.fetchDepot();
            this.fetchBoughtObjects();
        })
    }



    showHideDeposit(event) {
        event.preventDefault();
        let cancel = event.target.name === "cancel";
        this.setState({deposit: cancel ? false : true});
    }



    render() {
        let showDepositButton = this.state.deposit ? null : <button onClick={this.showHideDeposit}>Sätt in pengar</button>;
        let depositArea = this.state.deposit ? (
           <Choice action={this.handleDeposit} label="Summa" name="deposition" value={this.state.deposition} handleInputChange={this.handleInputChange} buttonTitle={"Sätt in pengar"} cancel={this.showHideDeposit}/>
       ) : null;

        let myObjects = this.state.myObjects.map(object => {
            let sellArea = this.state.selected === object.id ?
                <div className="sellArea">
                    <Choice action={this.handleSell} label="Antal" name="amount" value={this.state.amount} handleInputChange={this.handleInputChange} buttonTitle={"Sälj"} cancel={this.showHideSell}/>
                </div>
                : null;

            let showSellButton = this.state.selected !== object.id ? <button id={object.id} onClick={this.showHideSell}>Sälj</button> : null;
            return (
                <div key={object.id} className="object">
                    <h2>{functions.capitalizeFirstLetter(object.name)}</h2>
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
                    <div className="objects">{myObjects}</div>
                    {noObjectsMessage}
                </div>
            </main>
        );
    }
}

export default Depot;
