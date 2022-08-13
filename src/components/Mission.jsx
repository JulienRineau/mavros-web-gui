import React, { Component } from "react";
import Coordinates from "./Coordinates";
import Kill from "./Buttons/Kill";

class Mission extends Component {
  state = {};
  render() {
    return (
      <div className="d-grid gap-2">
        <Coordinates></Coordinates>
      </div>
    );
  }
}

export default Mission;
