import React, { Component } from 'react';


class Objects extends Component {
    constructor() {
        super()
        this.state = {
            objects: []
        };
    }


    fetchObjects() {
        fetch("https://proj-api.olliej.me/objects")
        .then(res => res.json())
        .then(data => this.setState({objects: data.data}))
    };


    componentDidMount() {
        this.fetchObjects()
    }




    render() { 

        const objects = this.state.objects.map((object, index) => {
            return <p key={index}>{object.name} {object.price}kr</p>
        })

        return (
           <div>
           <h1>OBJECTS</h1>
           {objects}
           </div>
       );
    }
}


export default Objects;
