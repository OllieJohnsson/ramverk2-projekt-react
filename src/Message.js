import React, {Component} from "react";

class Message extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        console.log(this.props);

        const color = this.props.errorMessage ? "#ED3B59" : "#60CE43";
        return (
            <div style={{border: `1px solid ${color}`}} className="message">
                <p style={{color: color, margin: 0}}>{this.props.errorMessage || this.props.message}</p>
            </div>


        );
    }
}


export default Message;
