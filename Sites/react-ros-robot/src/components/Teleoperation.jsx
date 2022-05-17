import React, { Component } from "react";
import { Joystick } from "react-joystick-component";
import { Row, Col, Container } from "react-bootstrap";

class Teleoperation extends Component {
  state = {};
  handleMove() {}
  handleStop() {}
  render() {
    return (
      <div>
        <h2>Teleoperation</h2>
        <Container>
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
