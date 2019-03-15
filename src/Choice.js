import React, {Component} from "react";

class Choice extends Component {

    render() {
        return (
            <div className="choiceArea">
                <form onSubmit={this.props.action} id="cancel">
                    <button className="cancelButton" name="cancel" onClick={this.props.cancel}><img src="https://img.icons8.com/material/12/ED3B59/delete-sign.png" alt="cancel"></img></button>
                    <label>{this.props.label}</label>
                    <input autoFocus type="number" value={this.props.value} name={this.props.name} placeholder={this.props.label} autoComplete="off" onChange={this.props.handleInputChange} min="1"></input>
                    <input type="submit" value={this.props.buttonTitle}></input>
                </form>
            </div>
        );
    }

}

export default Choice;
