import React, {Component} from "react";
import io from "socket.io-client";
import Rickshaw from 'rickshaw';
import "rickshaw/rickshaw.min.css";

import functions from "./functions";


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
        data.forEach(object => {
            console.log(object);
            let graphElement = document.createElement("div");
            // let yAxisElement = document.createElement("div");
            graphElement.id = `graph_${functions.slugify(object.name)}`;
            // yAxisElement.id = `y-axis_${this.slugify(object.name)}`;
            // yAxisElement.className = "y-axis";
            graphContainer.appendChild(graphElement);
            // graphElement.appendChild(yAxisElement);
        //
            let graph = new Rickshaw.Graph({
                element: graphElement,
                renderer: "line",
                series: new Rickshaw.Series.FixedDuration([{
                    name: object.name,
                    color: palette.color(),
                }], undefined, {
                    timeInterval: 5000,
                    maxDataPoints: 1000,
                    timeBase: new Date().getTime() / 1000
                })
            });

            new Rickshaw.Graph.Axis.Time( { graph: graph } );

            new Rickshaw.Graph.Axis.Y({
                graph: graph,
                orientation: 'left',
                tickFormat: Rickshaw.Fixtures.Number.formatKMBT
            });

            new Rickshaw.Graph.HoverDetail({
                graph: graph
            });

            let slug = functions.slugify(object.name);
            this.setState({
                graphs: [...this.state.graphs, {name: slug, graph: graph}],
                first: false
            });

            graph.render();
        });
    }


    updateGraph(data) {
        data.forEach(object => {
            let slug = functions.slugify(object.name);
            let data = {
                [slug]: object.price
            };

            let graphObject = this.state.graphs.filter(graphObject => {return graphObject.name === object.name})[0];
            if (graphObject) {
                graphObject.graph.series.addData(data);
                graphObject.graph.render();
            }
        });
    }







    render() {
        console.log(functions.capitalizeFirstLetter("hejhej"));
        console.log(process.env.NODE_ENV);
        console.log(this.state);
        return (
            <main>
                <h1>Stock</h1>
                <div id="graphContainer"></div>
            </main>
        );
    }
}

export default Stock;
