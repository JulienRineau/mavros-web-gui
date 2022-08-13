import React, { Component } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import Config from "../scripts/config";

class RobotState extends Component {
  state = {
    x: 0,
    y: 0,
    linear_velocity: 0,
    latitude: 0,
    longitude: 0,
    altitude: 0,
    battery: 0,
    ros: null,
  };

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
    var battery_subscriber = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: "/mavros/battery",
      messageType: "sensor_msgs/BatteryState",
    });

    battery_subscriber.subscribe((message) => {
      this.setState({ battery: message.percentage });
    });

    var latitude_subscriber = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: "/mavros/global_position/global",
      messageType: "sensor_msgs/NavSatFix",
    });

    latitude_subscriber.subscribe((message) => {
      this.setState({ latitude: message.latitude });
    });

    var longitude_subscriber = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: "/mavros/global_position/global",
      messageType: "sensor_msgs/NavSatFix",
    });

    longitude_subscriber.subscribe((message) => {
      this.setState({ longitude: message.longitude });
    });

    var altitude_subscriber = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: "/mavros/global_position/global",
      messageType: "sensor_msgs/NavSatFix",
    });

    altitude_subscriber.subscribe((message) => {
      this.setState({ altitude: message.altitude });
    });
  }

  render() {
    return (
      <div>
        <Row>
          <Col>
            <h2>State</h2>
            <p className="mt-0">Latitude: {this.state.latitude}</p>
            <p className="mt-0">Longitude: {this.state.longitude}</p>
            <p className="mt-0">Altitude: {this.state.altitude.toFixed(0)} m</p>
            <p className="mt-0">Velocity: {this.state.linear_velocity} m/s</p>
            <p className="mt-0">
              Battery: {this.state.battery.toFixed(3) * 100}%
            </p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default RobotState;
