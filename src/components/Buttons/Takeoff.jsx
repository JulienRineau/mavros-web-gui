import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Config from "../../scripts/config";

class Takeoff extends Component {
  state = { ros: null, arming: null };
  constructor() {
    super();
    this.init_connection();
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

  componentDidMount() {
    this.init_connection();
    this.takeoff = this.takeoff.bind(this);
  }

  takeoff() {
    console.log("Arm button clicked");
    var takingOff = new window.ROSLIB.Service({
      ros: this.state.ros,
      name: "/mavros/set_mode",
      serviceType: "mavros_msgs/SetMode",
    });

    var request = new window.ROSLIB.ServiceRequest({
      base_mode: 0,
      custom_mode: "AUTO.TAKEOFF",
    });

    takingOff.callService(request, function (result) {
      console.log(
        "Result for " + takingOff.name + ":" + JSON.stringify(result)
      );
    });
  }

  render() {
    return (
      <Button onClick={this.takeoff} variant="primary">
        Takeoff
      </Button>
    );
  }
}

export default Takeoff;
