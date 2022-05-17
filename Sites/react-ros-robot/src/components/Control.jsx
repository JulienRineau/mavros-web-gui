import React, { Component } from "react";
import Arm from "./Buttons/Arm";
import Takeoff from "./Buttons/Takeoff";
import Land from "./Buttons/Land";
import Hover from "./Buttons/Hover";

import { Row, Col, Container, Button } from "react-bootstrap";

class Control extends Component {
  state = {};
  render() {
    return (
      <div className="d-grid gap-2">
        <Arm></Arm>
        <Takeoff></Takeoff>
        <Land></Land>
        <Hover></Hover>
      </div>
    );
  }
}

export default Control;
