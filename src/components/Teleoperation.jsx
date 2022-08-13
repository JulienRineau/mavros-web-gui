import React, { Component } from "react";
import Disarm from "./Buttons/Disarm";
import Arm from "./Buttons/Arm";
import { Joystick } from "react-joystick-component";
import { Row, Col, Container } from "react-bootstrap";
import Config from "../scripts/config";
import { Button } from "react-bootstrap";

class Teleoperation extends Component {
  state = { ros: null, isArmed: "bruh" };

  constructor() {
    super();
  }

  init_connection() {
    this.state.ros = new window.ROSLIB.Ros(); // Using window bc using CDN for ROSLIB and not NPM package

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

  handleMove() {
    var cmd_vel = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: "/mavros/setpoint_velocity/cmd_vel_unstamped",
      messageType: "geometry_msgs/Twist",
    });

    var twist = new window.ROSLIB.Message({
      linear: {
        x: 0.5,
        y: 0.0,
        z: 0.0,
      },
      angular: {
        x: 0.0,
        y: 0.0,
        z: 0.0,
      },
    });
    cmd_vel.publish(twist);
  }

  handleStop() {
    var cmd_vel = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: "/mavros/setpoint_velocity/cmd_vel_unstamped",
      messageType: "geometry_msgs/Twist",
    });

    var twist = new window.ROSLIB.Message({
      linear: {
        x: 0.0,
        y: 0.0,
        z: 0.0,
      },
      angular: {
        x: 0.0,
        y: 0.0,
        z: 0.0,
      },
    });
    cmd_vel.publish(twist);
  }

  offboard() {
    var offboard_mode = new window.ROSLIB.Service({
      ros: this.state.ros,
      name: "/mavros/set_mode",
      serviceType: "mavros_msgs/SetMode",
    });

    var request = new window.ROSLIB.ServiceRequest({
      base_mode: 0,
      custom_mode: "OFFBOARD",
    });

    offboard_mode.callService(request, function (result) {
      console.log(
        "Result for " + offboard_mode.name + ":" + JSON.stringify(result)
      );
    });
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
  }

  render() {
    return (
      <div>
        <h2>Teleoperation</h2>

        <Container>
          <Row>
            {" "}
            <Button onClick={this.offboard} variant="primary">
              Offboard
            </Button>
          </Row>
          <Row className="justify-content-md-center">
            <Col>
              {" "}
              <Joystick
                size={80}
                sticky={false}
                baseColor="#EEEEEE"
                stickColor="#BBBBBB"
                move={this.handleMove}
                stop={this.handleStop}
              ></Joystick>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Teleoperation;
