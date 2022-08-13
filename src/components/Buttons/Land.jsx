import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Config from "../../scripts/config";

class Land extends Component {
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

    this.land = this.land.bind(this);
  }

  land() {
    console.log("Arm button clicked");
    var landing = new window.ROSLIB.Service({
      ros: this.state.ros,
      name: "/mavros/cmd/land",
      serviceType: "mavros_msgs/CommandBool",
    });

    var request = new window.ROSLIB.ServiceRequest({
      min_pitch: 0,
      yaw: 0,
      latitude: 0,
      longitude: 0,
      altitude: 3.0,
    });

    landing.callService(request, function (result) {
      console.log("Result for " + landing.name + ":" + JSON.stringify(result));
    });
  }

  render() {
    return (
      <Button onClick={this.land} variant="primary">
        Land
      </Button>
    );
  }
}

export default Land;
