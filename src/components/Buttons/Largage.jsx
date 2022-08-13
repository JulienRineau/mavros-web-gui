import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Config from "../../scripts/config";

class Largage extends Component {
  state = { ros: null, arming: null, hole: true };
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
    this.larg = this.larg.bind(this);
    this.init_connection();
  }

  larg() {
    console.log("Arm button clicked");
    var delivering = new window.ROSLIB.Service({
      ros: this.state.ros,
      name: "/delivery_motor",
      serviceType: "td_srvs/SetBool",
    });

    var request = new window.ROSLIB.ServiceRequest({
      data: this.state.hole,
    });

    delivering.callService(request, function (result) {
      console.log(
        "Result for " + delivering.name + ":" + JSON.stringify(result)
      );
    });
    this.setState({ hole: !this.state.hole });
  }

  render() {
    return (
      <Button onClick={this.larg} variant="primary">
        Deliver
      </Button>
    );
  }
}

export default Largage;
