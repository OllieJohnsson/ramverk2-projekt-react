import React, { Component } from 'react';
import functions from "./functions";
import Choice from "./Choice";

class Objects extends Component {
    constructor(props) {
        super(props)
        this.state = {
            objects: [],
            selected: null,
            amount: 1
        };

        this.showHideBuy = this.showHideBuy.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBuy = this.handleBuy.bind(this);
    }


    fetchObjects() {
        fetch("https://proj-api.olliej.me/objects", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.props.token
            }
        })
        .then(res => res.json())
        .then(objects => {
            if (objects.error) {
                return this.props.logout();
            }
            this.setState({objects: objects.data});
        })
    };


    componentWillMount() {
        this.fetchObjects()
    }

    showHideBuy(event) {
        event.preventDefault();
        let cancel = event.target.name === "cancel";
        this.setState({
            selected: cancel ? null : parseInt(event.target.id),
            amount: 1
        });
    }



    handleBuy(event) {
        event.preventDefault();
        fetch("https://proj-api.olliej.me/user/buy", {
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
            this.fetchObjects();
        })
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: parseInt(event.target.value)
        });
    }


    render() {
        const objects = this.state.objects.map((object) => {
            let buyArea = this.state.selected === object.id ?
                <Choice action={this.handleBuy} label="Antal" name="amount" value={this.state.amount} handleInputChange={this.handleInputChange} buttonTitle={"Köp"} cancel={this.showHideBuy}/>
                : null;

            let showBuyButton = this.state.selected !== object.id ? <button id={object.id} onClick={this.showHideBuy}>Köp</button> : null;
            return (
                <div key={object.id} className="object">
                    <h2>{functions.capitalizeFirstLetter(object.name)}</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td>Pris:</td>
                                <td>{object.price.toFixed(2)}kr</td>
                            </tr>
                            <tr>
                                <td>Tillgängligt:</td>
                                <td>{object.stock}st</td>
                            </tr>
                        </tbody>
                    </table>
                    {showBuyButton}
                    {buyArea}
                </div>
            );
        })



        return (
        <main>
            <h1>Objekt</h1>
            <div className="objects">{objects}</div>
        </main>
       );
    }
}


export default Objects;
