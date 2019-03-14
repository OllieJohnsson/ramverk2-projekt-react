import React, { Component } from 'react';
import Message from "./Message";

class Objects extends Component {
    constructor(props) {
        super(props)
        this.state = {
            objects: [],
            selected: null,
            amount: 1
        };

        this.showBuy = this.showBuy.bind(this);
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
        .then(data => this.setState({objects: data.data}))
    };


    componentWillMount() {
        this.fetchObjects()
    }

    showBuy(event) {
        event.preventDefault();
        this.setState({
            selected: parseInt(event.target.id),
            amount: 1,
            errorMessage: null,
            message: null
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
            this.fetchObjects();
        })
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: parseInt(event.target.value)
        });
    }


    render() {
        let message = this.state.errorMessage || this.state.message ?
            <Message errorMessage={this.state.errorMessage} message={this.state.message} />
             : null;
        const objects = this.state.objects.map((object) => {
            let buyArea = this.state.selected === object.id ?
                <div className="buyArea">
                    <form onSubmit={this.handleBuy}>
                        <label>Antal</label>
                        <input type="number" value={this.state.amount} name="amount" placeholder="Antal" autoComplete="off" onChange={this.handleInputChange}></input>
                        <input type="submit" value="Köp"></input>
                    </form>
                </div>
                : null;

            let showBuyButton = this.state.selected !== object.id ? <button id={object.id} onClick={this.showBuy}>Köp</button> : null;
            return (
                <div key={object.id} className="object">
                    <h2>{object.name}</h2>
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
            {objects}
            {message}
        </main>
       );
    }
}


export default Objects;
