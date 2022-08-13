import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Config from "../../scripts/config";

class Hover extends Component {
  state = { ros: null, arming: null };
  constructor() {
    super();
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
    this.init_connection();
    this.hold = this.hold.bind(this);
  }

  hold() {
    console.log("Arm button clicked");
    var takingOff = new window.ROSLIB.Service({
      ros: this.state.ros,
      name: "/mavros/set_mode",
      serviceType: "mavros_msgs/SetMode",
    });

    var request = new window.ROSLIB.ServiceRequest({
      base_mode: 0,
      custom_mode: "AUTO.LOITER",
    });

    takingOff.callService(request, function (result) {
      console.log(
        "Result for " + takingOff.name + ":" + JSON.stringify(result)
      );
    });
  }

  render() {
    return (
      <Button onClick={this.hold} variant="primary">
        Hold
      </Button>
    );
  }
}

export default Hover;
