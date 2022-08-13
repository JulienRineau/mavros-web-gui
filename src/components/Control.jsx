import React, { Component } from "react";
import Takeoff from "./Buttons/Takeoff";
import Arm from "./Buttons/Arm";
import Disarm from "./Buttons/Disarm";
import Land from "./Buttons/Land";
import Hold from "./Buttons/Hold";
import Offboard from "./Buttons/Offboard";
import Largage from "./Buttons/Largage";
import { Row, Col, Container, Button } from "react-bootstrap";
import Config from "../scripts/config";

class Control extends Component {
  state = { isArmed: false, mode: null };

  constructor() {
    super();
    this.init_connection();
  }

  init_connection() {
    this.state.ros = new window.ROSLIB.Ros(); // Using window bc using CDN for ROSLIB and not NPM package
    console.log(this.state.ros);

    // Changing changing button color according to connection state
    this.state.ros.on("connection", () => {
      this.setState({ connected: true });
    });

    this.state.ros.on("close", () => {
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
      this.setState({ isArmed: message.armed });
    });

    state_subscriber.subscribe((message) => {
      this.setState({ mode: message.mode });
    });
  }

  render() {
    return (
      <div className="d-grid gap-2">
        <Row>{this.state.isArmed ? <Disarm></Disarm> : <Arm></Arm>}</Row>
        <Row>
          <Takeoff></Takeoff>
        </Row>
        <Row>
          <Land></Land>
        </Row>
        <Row>
          <Hold></Hold>
        </Row>
        <Row>
          <Largage></Largage>
        </Row>
      </div>
    );
  }
}

export default Control;
