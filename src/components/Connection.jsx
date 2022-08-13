import React, { Component } from "react";
import { Alert } from "react-bootstrap";
import Config from "../scripts/config";

class Connection extends Component {
  state = { connected: false, ros: null, mode: null };

  constructor() {
    super();
    this.init_connection();
  }

  init_connection() {
    this.state.ros = new window.ROSLIB.Ros(); // Using window bc using CDN for ROSLIB and not NPM package
    console.log(this.state.ros);

    // Changing changing button color according to connection state
    this.state.ros.on("connection", () => {
      console.log("Connection established.");
      this.setState({ connected: true });
      this.getDroneState();
    });

    this.state.ros.on("close", () => {
      console.log("Connection closed.");
      this.setState({ connected: false });
      //try to reconnect every 2 seconds
      setTimeout(() => {
        try {
          this.state.ros.connect(
            "ws://" +
              Config.ROSBRIDGE_SERVER_IP +
              ":" +
              Config.ROSBRIDGE_SERVER_PORT +
              ""
          );
        } catch (error) {
          console.log("connection problem");
        }
      }, Config.RECONNECTION_TIMER);
    });

    try {
      this.state.ros.connect(
        "ws://" +
          Config.ROSBRIDGE_SERVER_IP +
          ":" +
          Config.ROSBRIDGE_SERVER_PORT +
          ""
      );
    } catch (error) {
      console.log("connection problem");
    }
  }

  componentDidMount() {
    this.getDroneState();
  }

  getDroneState() {
    // create a pose subscriber
    var state_subscriber = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: "/mavros/state",
      messageType: "mavros_msgs/State",
    });

    state_subscriber.subscribe((message) => {
      this.setState({ mode: message.mode });
    });
  }

  render() {
    return (
      <Alert
        className="text-center my-4"
        variant={this.state.connected ? "success" : "danger"}
      >
        {this.state.connected
          ? "Drone Connected: " + this.state.mode
          : "Drone Disconnected"}
      </Alert>
    );
  }
}

export default Connection;
