import React, {Component} from "react";

class Message extends Component {

    render() {
        const color = this.props.error ? "#ED3B59" : "#60CE43";
        let show = this.props.success || this.props.error ? " showMessage" : "";
        return (
            <div style={{borderColor: color}} className={`message${show}`}>
                <p style={{color: color, margin: 0}}>{this.props.error || this.props.success}</p>
            </div>
        );
    }
}

export default Message;
