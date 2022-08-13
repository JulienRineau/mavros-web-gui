import React, { Component } from "react";
import Connection from "./Connection";
import Teleoperation from "./Teleoperation";
import { Row, Col, Container, Button } from "react-bootstrap";
import Control from "./Control";
import Mission from "./Mission";
import RobotState from "./RobotState";
import Coordinates from "./Coordinates";
import Delivery from "./Delivery";

class Home extends Component {
  state = {
    counter: 0,
  };

  increment() {
    this.setState({ counter: this.state.counter + 1 });
  }

  render() {
    return (
      <div>
        <Container>
          <h1 className="text-center mt-3">Drone Control Page</h1>
          <Row>
            <Col>
              <Connection />
            </Col>
          </Row>
          <Row>
            <Col>
              <Teleoperation />
            </Col>
            <Col>
              <RobotState />
            </Col>
            <Col>
              <h2>Control</h2>
              <Control />
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Set Point</h2>
              <Coordinates />
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Livraison</h2>
              <Delivery />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;
