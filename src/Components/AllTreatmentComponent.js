import React, { Component } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  FormFeedback,
  Card,
  CardImg,
  CardImgOverlay,
  CardTitle,
  CardBody,
  CardText,
} from "reactstrap";
import { BrowserRouter, NavLink } from "react-router-dom";

import { render } from "react-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
var mst;
var alldocs = [];
function Allpatrender({ treatment }) {
  // var xy = treatment.dateofComp;
  // var yz = xy != 0?"bg-success text-white":"";

  return (
    <Card>
      <Link to={`/treatment/${treatment.treatment_Id}`}>
        <i className="fa fa-medkit fa-5x"></i>
        <CardBody>
          <CardTitle>Treatment ID : {treatment.treatment_Id}</CardTitle>
          <CardText>
            <small>Patient Aadhar : {treatment.patientAadhar}</small>
          </CardText>
          <CardText>
            <small>Admin Aadhar : {treatment.adminAadhar}</small>
          </CardText>
        </CardBody>
      </Link>
    </Card>
  );
}

class AllTreatmentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { docCount: 0, treatments: [] };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleValidateAadhar = () => {
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
    } else {
      this.setState({ validateText: "" });
      return "ok";
    }
  };

  async handleSubmit(event) {
    console.log("Current State" + JSON.stringify(this.state));
    event.preventDefault();
    if (this.handleValidateAadhar() === "ok") {
      const res = await this.props.contract.methods
        .patientAadhars(this.state.patAadhar)
        .call();
      if (res.patient_Id == "0") {
        this.setState({ validateText: "Patient doesn't exists" });
        this.setState({ validate: true });
      }
      var mst = await this.props.contract.methods
        .getTreatmentGone(this.state.patAadhar)
        .call();
      console.log("mst", mst);
      var arr = [];
      mst.map((ms) => {
        arr.push(Number(ms));
      });

      console.log("fdsaf", arr);
      var response2 = [];
      for (var i = 0; i < arr.length; i++) {
        var rex = await this.props.contract?.methods.treatments(arr[i]).call();
        response2.push(rex);
      }
      // alldocs = [];
      // alldocs = response.filter((resp) => resp.doctor_add == this.props.accounts[0])
      console.log(response2);
      this.setState({ treatments: response2 });
      console.log("Current State" + JSON.stringify(this.state));
      // console.log(res);
    } else {
      this.setState({ validate: true });
    }
  }

  async componentDidMount() {
    var res = await this.props.contract?.methods.treatmentCount().call();

    var response = [];
    for (var i = 1; i <= res; i++) {
      var rex = await this.props.contract?.methods.treatments(i).call();
      response.push(rex);
    }
    // alldocs = [];
    // alldocs = response.filter((resp) => resp.doctor_add == this.props.accounts[0])
    console.log(response);
    this.setState({ treatments: response });
  }

  render() {
    const Menu = this.state.treatments.map((x) => {
      return (
        <div key={x} className="col-4 col-md-3">
          <Allpatrender treatment={x} />
        </div>
      );
    });
    return (
      <div className="container">
        <h2>Treatment Details</h2>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup row>
            <Label htmlFor="patAadhar" md={2}>
              Patient Aadhar
            </Label>
            <Col md={10}>
              <Input
                type="text"
                id="patAadhar"
                name="patAadhar"
                placeholder="Patient Aadhar No."
                value={this.state.patAadhar}
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
            <Col md={{ size: 12 }}>
              <Button type="submit" color="primary">
                Get Data
              </Button>
            </Col>
          </FormGroup>
        </Form>
        <h2>All Treatment</h2>
        <div className="row">{Menu}</div>
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  }
}

export default AllTreatmentComponent;
