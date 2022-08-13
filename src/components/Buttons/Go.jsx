import React, { Component } from "react";
import { Button } from "react-bootstrap";

class Go extends Component {
  state = {};
  render() {
    return (
      <Button variant="primary" disabled>
        Go
      </Button>
    );
  }
}

export default Go;
