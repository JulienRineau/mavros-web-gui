import React, { Component } from "react";
import { Button } from "react-bootstrap";

class Hover extends Component {
  state = {};
  render() {
    return (
      <Button variant="warning" disabled>
        Hover
      </Button>
    );
  }
}

export default Hover;
