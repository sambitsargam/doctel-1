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
} from "reactstrap";
import "../App.css";
import { render } from "react-dom";
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

class TreatmentComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patAadhar: 0,
      symptoms: "",
      medications: "",
      treatcount: 0,
      procedure: "",
      description: "",
      prescription: "",
      treatId: 0,
      loading: "",
      patstate: "Active",
      buffer: null,
      docaccount: "",
      docAadhar: 0,
    };
    this.handleSubmitadd = this.handleSubmitadd.bind(this);
    this.handleSubmitmod = this.handleSubmitmod.bind(this);
    this.handleSubmitsenddoc = this.handleSubmitsenddoc.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.captureFile = this.captureFile.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  uploadImage = (x) => {
    console.log("Time start file to ipfs", Date.now());
    console.log("Submitting file to ipfs...");
    //adding file to the IPFS
    //console.log(this.state.buffer);
    ipfs
      .add(this.state.buffer, (error, result) => {
        console.log("Ipfs result", result);
        if (error) {
          console.log("error");
          console.error(error);
          return;
        }
        console.log("complete");
        this.setState({ loading: true });
      })
      .then((response) => {
        console.log(response.path);
        if (x == 1) {
          const res = this.props.contract.methods
            .addPrescriptionTreat(this.state.treatId, response.path)
            .send({ from: this.props.accounts, gas: 1000000 })
            .on("transactionHash", (hash) => {
              this.setState({ loading: false });
              console.log("Time end trans ended", Date.now());
            });
        } else if (x == 2) {
          const res = this.props.contract.methods
            .addReportTreat(this.state.treatId, response.path)
            .send({ from: this.props.accounts, gas: 1000000 })
            .on("transactionHash", (hash) => {
              this.setState({ loading: false });
              console.log("Time end trans ended", Date.now());
            });
        }
      });
    console.log("Time end file uploaded", Date.now());
  };

  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  };
  async handleSubmitadd(event) {
    console.log("Current State" + JSON.stringify(this.state));
    event.preventDefault();
    console.log("Time start Treatment Add", Date.now());
    const res = await this.props.contract.methods
      .addTreatment(localStorage.getItem("myAadhar"), this.state.patAadhar)
      .send({ from: this.props.accounts, gas: 1000000 });
    const treatcount = await this.props.contract.methods
      .treatmentCount()
      .call();
    this.setState({
      treatcount: treatcount,
    });
    console.log(this.state.treatcount);
    console.log("Time end Treatment Add", Date.now());
  }
  async handleSubmitsenddoc(event) {
    event.preventDefault();
    console.log("Time start Doctor added to Treatment", Date.now());
    const res = await this.props.contract.methods
      .addDoctorToTreatment(this.state.treatId, this.state.docAadhar)
      .send({ from: this.props.accounts, gas: 1000000 });
    console.log(res);
    console.log("Time end Doctor added to Treatment", Date.now());
  }

  async handleSubmitmod(event) {
    event.preventDefault();
    var patientstate = 0;
    if (this.state.patstate == "Recovered") {
      patientstate = 1;
    } else {
      patientstate = 2;
    }
    console.log("Current State" + JSON.stringify(this.state));
    let resi = await this.props.contract.methods
      .dotreatment(
        this.state.treatId,
        this.state.procedure,
        this.state.description,
        this.state.prescription,
        patientstate
      )
      .send({ from: this.props.accounts[0], gas: 1000000 });
    console.log(resi);
  }

  render() {
    return (
      <div className="container">
        <h2>Add Treatment</h2>

        <Form onSubmit={this.handleSubmitadd}>
          <FormGroup row>
            <Label htmlFor="patAadhar" md={2}>
              Patient Aadhar
            </Label>
            <Col md={10}>
              <Input
                type="number"
                id="patAadhar"
                name="patAadhar"
                placeholder="Patient Account Address"
                value={this.state.patAadhar}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md={{ size: 8 }}>
              <Button type="submit" color="primary">
                Add Treatment
              </Button>
            </Col>
            <Col md={{ size: 2 }}>
              <Button color="success">{this.state.treatcount}</Button>
            </Col>
          </FormGroup>
        </Form>
        <br />
        <br />
        <h2>Add Doctor</h2>
        <Form onSubmit={this.handleSubmitsenddoc}>
          <FormGroup row>
            <Label htmlFor="treatId" md={2}>
              Treatment Id
            </Label>
            <Col md={10}>
              <Input
                type="number"
                id="treatId"
                name="treatId"
                placeholder="Treatment Id"
                value={this.state.treatId}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label htmlFor="docAadhar" md={2}>
              Doctor Aadhar
            </Label>
            <Col md={10}>
              <Input
                type="number"
                id="docAadhar"
                name="docAadhar"
                placeholder="Doctor Aadhar"
                value={this.state.docAadhar}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md={{ size: 8, offset: 2 }}>
              <Button type="submit" color="primary">
                Send Treatment
              </Button>
            </Col>
          </FormGroup>
        </Form>
        <br />
        <br />
        <h2>Add Prescription and Report</h2>
        <Form>
          <FormGroup row>
            <Label htmlFor="treatId" md={2}>
              Treatment Id
            </Label>
            <Col md={10}>
              <Input
                type="number"
                id="treatId"
                name="treatId"
                placeholder="Treatment Id"
                value={this.state.treatId}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label htmlFor="prescriptionUpload" className="ml-3">
              Prescription Upload
            </Label>
            <Input
              type="file"
              accept=".jpg, .jpeg, .png, .bmp, .gif"
              name="prescriptionUpload"
              onChange={this.captureFile}
            />
          </FormGroup>
          <FormGroup row>
            <div>
              <Button
                color="primary"
                onClick={() => {
                  this.uploadImage(1);
                }}
              >
                Add
              </Button>
            </div>
          </FormGroup>
        </Form>
        <Form>
          <FormGroup row>
            <Label htmlFor="treatId" md={2}>
              Treatment Id
            </Label>
            <Col md={10}>
              <Input
                type="number"
                id="treatId"
                name="treatId"
                placeholder="Treatment Id"
                value={this.state.treatId}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label htmlFor="reportUpload" className="ml-3">
              Report Upload
            </Label>
            <Input
              type="file"
              accept=".jpg, .jpeg, .png, .bmp, .gif"
              name="reportUpload"
              onChange={this.captureFile}
            />
          </FormGroup>
          <FormGroup row>
            <div>
              <Button
                color="primary"
                onClick={() => {
                  this.uploadImage(2);
                }}
              >
                Add
              </Button>
            </div>
          </FormGroup>
        </Form>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  }
}

export default TreatmentComp;
