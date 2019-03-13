import React, {Component} from "react";
import io from "socket.io-client";
import Rickshaw from 'rickshaw';
import "rickshaw/rickshaw.min.css";


class Stock extends Component {
    constructor(props) {
        super(props);

        let url = process.env.NODE_ENV === "development" ? "localhost:4321" : "https://proj-stock.olliej.me";
        this.socket = io.connect(url);

        this.state = {
            graphs: [],
            first: true
        };

        this.setupGraph = this.setupGraph.bind(this);
        this.updateGraph = this.updateGraph.bind(this);
        // this.updatePrice = this.updatePrice.bind(this);
        this.setupSocket();
    }


    setupSocket() {
        this.socket.on("connect_failed", () => {
            console.log("Failed to connect");
        })
        this.socket.on("connect", () => {
            console.log("Connected!");
        })
        this.socket.on("disconnect", () => {
            console.log("Disconnected!");
        })
        this.socket.on("stocks", (data) => {
            console.log("Received stocks", data);
            this.state.first ? this.setupGraph(data) : this.updateGraph(data);
        })
    }


    setupGraph(data) {
        var palette = new Rickshaw.Color.Palette({ scheme: 'colorwheel' });
        let graphContainer = document.getElementById("graphContainer");
        data.map(object => {
            let graphElement = document.createElement("div");
            let yAxisElement = document.createElement("div");
            graphElement.id = `graph_${this.slugify(object.name)}`;
            yAxisElement.id = `y-axis_${this.slugify(object.name)}`;
            yAxisElement.className = "y-axis";
            graphContainer.appendChild(graphElement);
            graphElement.appendChild(yAxisElement);

            let graph = new Rickshaw.Graph( {
                element: graphElement,
                renderer: "line",
                // width: "500",
                // height: "100",
                // series: [
                //     {
                //         color: '#123',
                //         data: [ { x: 0, y: 23}, { x: 1, y: 15 }, { x: 2, y: 79 } ]
                //     }, {
                //         color: 'lightblue',
                //         data: [ { x: 0, y: 30}, { x: 1, y: 20 }, { x: 2, y: 64 } ]
                //     }
                // ]

                series: new Rickshaw.Series.FixedDuration([{
                    name: object.name,
                    color: palette.color(),
                }], undefined, {
                    timeInterval: 5000,
                    maxDataPoints: 1000,
                    timeBase: new Date().getTime() / 1000
                })
            });


            // graph.configure({
            //     width: graphContainer.clientWidth,
            // });

            new Rickshaw.Graph.Axis.Time( { graph: graph } );

            new Rickshaw.Graph.Axis.Y({
                graph: graph,
                orientation: 'left',
                tickFormat: Rickshaw.Fixtures.Number.formatKMBT
            });

            new Rickshaw.Graph.HoverDetail({
                graph: graph
            });

            graph.render();

            let slug = this.slugify(object.name);

            this.setState({
                graphs: [...this.state.graphs, {name: object.name, graph: graph}]
            });
            this.setState({first: false});
        });
    }


    updateGraph(data) {
        console.log("updating", data);

        data.map(object => {
            console.log("EHHEHE", object);
            let slug = this.slugify(object.name);
            let data = {
                [object.name]: object.price
            };


            let graphObject = this.state.graphs.filter(graphObject => {return graphObject.name === object.name})[0];
            console.log("GO", graphObject);
            graphObject.graph.series.addData(data);
            graphObject.graph.render();
        });

        console.log(this.state);
    }




    slugify(text) {
        return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w-]+/g, '')       // Remove all non-word chars
        .replace(/--+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
    }



    render() {
        return (
            <main>
                <h1>Stock</h1>
                <div id="graphContainer"></div>
            </main>
        );
    }
}

export default Stock;
