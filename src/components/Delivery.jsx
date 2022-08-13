import React, { Component } from "react";
import { FormControl } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import { Row, Col, Container } from "react-bootstrap";
import { Form } from "react-bootstrap";
import Config from "../scripts/config";
import { Button } from "react-bootstrap";

class Delivery extends Component {
  state = {
    ros: null,
    checked: false,
    setpoint_x: 0,
    setpoint_y: 0,
    setpoint_z: 0,
  };

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
    this.goTo = this.goTo.bind(this);
  }

  goTo() {
    var cmd_pose = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: "mavros/setpoint_position/local",
      messageType: "geometry_msgs/PoseStamped",
    });

    var PoseStamped = new window.ROSLIB.Message({
      header: {
        seq: 0,
        stamp: {
          secs: 0,
          nsecs: 0,
        },
        frame_id: "",
      },
      pose: {
        position: {
          x: this.state.setpoint_x,
          y: this.state.setpoint_y,
          z: this.state.setpoint_z,
        },
        orientation: {
          x: 0.0,
          y: 0.0,
          z: 0.0,
          w: 0.0,
        },
      },
    });

    cmd_pose.publish(PoseStamped);
  }

  render() {
    return (
      <div className="d-grid">
        {" "}
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <FormControl
                value={this.state.setpoint_x}
                onChange={(e) =>
                  this.setState({ setpoint_x: parseFloat(e.target.value) })
                }
                aria-label="X"
                aria-describedby="basic-addon1"
                type="number"
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <FormControl
                value={this.state.setpoint_y}
                onChange={(e) =>
                  this.setState({ setpoint_y: parseFloat(e.target.value) })
                }
                aria-label="Y"
                aria-describedby="basic-addon1"
                type="number"
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <FormControl
                value={this.state.setpoint_z}
                onChange={(e) =>
                  this.setState({ setpoint_z: parseFloat(e.target.value) })
                }
                aria-label="Z"
                aria-describedby="basic-addon1"
                type="number"
              />
            </InputGroup>
          </Col>
          <Col>
            {" "}
            <Button onClick={this.arm} variant="success">
              Save
            </Button>
          </Col>
        </Row>
        <Button onClick={this.goTo} variant="primary">
          Go{" "}
        </Button>
      </div>
    );
  }
}

export default Delivery;
