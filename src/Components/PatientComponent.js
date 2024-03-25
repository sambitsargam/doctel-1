import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";
import "../App.css";

class PatientComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patAadhar: 0,
      weight: 0,
      height: 0,
      gender: 0,
      bloodtype: 0,
      dob: 0,
      location: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.Gender = this.Gender.bind(this);
    this.Bloodtype = this.Bloodtype.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (this.handleValidateAll() === "ok") {
      let genderLocal = this.Gender(this.state.gender);
      let bloodtypeLocal = this.Bloodtype(this.state.bloodtype);
      let dobNew = +new Date(this.state.dob);
      console.log(
        "Current State",
        this.state.patAadhar,
        this.state.weight,
        this.state.height,
        genderLocal,
        dobNew / 1000,
        bloodtypeLocal,
        this.state.location
      );
      console.log("Time start Add patient", Date.now());
      const res = await this.props.contract.methods
        .addPatient(
          this.state.patAadhar,
          this.state.weight,
          this.state.height,
          genderLocal,
          dobNew / 1000,
          bloodtypeLocal,
          this.state.location
        )
        .send({ from: this.props.accounts, gas: 1000000 });
      console.log(res);
      console.log("Time end Add patient", Date.now());
    } else {
      this.setState({ validate: true });
    }
  }

  handleValidateAll = () => {
    if (this.state.patAadhar.length > 10) {
      this.setState({
        validateText: "Aadhar no. should be less than 10 digits",
      });
    } else if (this.state.patAadhar.length < 10) {
      this.setState({
        validateText: "Aadhar no. should be more than 10 digits",
      });
    } else if (!new RegExp("^[0-9]*$").test(this.state.patAadhar)) {
      this.setState({ validateText: "Aadhar no. should be only digits" });
    } else if (this.state.weight > 500000) {
      this.setState({ validateText: "Weight cannot be more than 500 kgs" });
    } else if (this.state.height > 300) {
      this.setState({ validateText: "Height cannot be more than 300 cms" });
    } else {
      this.setState({ validateText: "" });
      return "ok";
    }
  };

  Gender(genInput) {
    switch (genInput) {
      case "Male":
        return 0;
      case "Female":
        return 1;
    }
  }

  Bloodtype(bloodInput) {
    switch (bloodInput) {
      case "A":
        return 0;
      case "B":
        return 1;
      case "AB":
        return 2;
      case "O":
        return 3;
    }
  }

  render() {
    return (
      <div className="container">
        <h2>Add Patient</h2>

        <Form onSubmit={this.handleSubmit}>
          <FormGroup row>
            <Label htmlFor="patAadhar" md={2}>
              Patient Aadhar
            </Label>
            <Col md={10}>
              <Input
                type="number"
                id="patAadhar"
                name="patAadhar"
                placeholder="Patient Aadhar"
                value={this.state.patAadhar}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label htmlFor="weight" md={2}>
              Weight
            </Label>
            <Col md={10}>
              <Input
                type="number"
                id="weight"
                name="weight"
                placeholder="Weight"
                value={this.state.weight}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label htmlFor="height" md={2}>
              Height
            </Label>
            <Col md={10}>
              <Input
                type="number"
                id="height"
                name="height"
                placeholder="Height"
                value={this.state.height}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label htmlFor="gender" md={2}>
              Gender
            </Label>
            <Col md={4}>
              <Input
                type="select"
                name="gender"
                value={this.state.gender}
                onChange={this.handleInputChange}
              >
                <option>Male</option>
                <option>Female</option>
              </Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label htmlFor="bloodtype" md={2}>
              Blood Type
            </Label>
            <Col md={4}>
              <Input
                type="select"
                name="bloodtype"
                value={this.state.bloodtype}
                onChange={this.handleInputChange}
              >
                <option>A</option>
                <option>B</option>
                <option>AB</option>
                <option>O</option>
              </Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label htmlFor="dob" md={2}>
              Date of Birth
            </Label>
            <Col md={10}>
              <Input
                type="datetime-local"
                id="dob"
                name="dob"
                placeholder="dob"
                value={this.state.dob}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label htmlFor="location" md={2}>
              Location
            </Label>
            <Col md={10}>
              <Input
                type="text"
                id="location"
                name="location"
                placeholder="Location"
                value={this.state.location}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>
          {this.state.validate === true ? (
            <p style={{ color: "red" }}>{this.state.validateText}</p>
          ) : (
            <></>
          )}
          <FormGroup row>
            <Col md={{ size: 10, offset: 2 }}>
              <Button type="submit" color="primary">
                Add Patient
              </Button>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default PatientComp;
