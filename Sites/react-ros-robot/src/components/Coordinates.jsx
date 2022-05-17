import React, { Component } from "react";
import { FormControl } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import Go from "./Buttons/Go";
import { Row, Col, Container } from "react-bootstrap";
import { Form } from "react-bootstrap";

class Coordinates extends Component {
  state = { checked: false };
  render() {
    return (
      <div className="d-grid">
        {" "}
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="X"
                aria-label="X"
                aria-describedby="basic-addon1"
                type="number"
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Y"
                aria-label="Y"
                aria-describedby="basic-addon1"
                type="number"
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Z"
                aria-label="Z"
                aria-describedby="basic-addon1"
                type="number"
              />
            </InputGroup>
          </Col>
          <Col>
            <Form.Check type="switch" id="custom-switch" />
          </Col>
        </Row>
        <Go></Go>
      </div>
    );
  }
}

export default Coordinates;
