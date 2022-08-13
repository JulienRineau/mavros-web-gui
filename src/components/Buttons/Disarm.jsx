import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Config from "../../scripts/config";

class Disarm extends Component {
  state = { ros: null, arming: null };
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

  componentDidMount() {
    this.init_connection();
    this.disarm = this.disarm.bind(this);
  }

  disarm() {
    console.log("Arm button clicked");
    var disarming = new window.ROSLIB.Service({
      ros: this.state.ros,
      name: "/mavros/cmd/arming",
      serviceType: "mavros_msgs/CommandBool",
    });

    var request = new window.ROSLIB.ServiceRequest({
      value: false,
    });

    disarming.callService(request, function (result) {
      console.log(
        "Result for " + disarming.name + ":" + JSON.stringify(result)
      );
    });
  }

  render() {
    return (
      <Button onClick={this.disarm} variant="danger">
        Disarm
      </Button>
    );
  }
}

export default Disarm;
