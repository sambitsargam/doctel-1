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
import axios from 'axios';

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
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }


  uploadImage = async (x) => {
    console.log("Starting file upload to Filebase");
    if (!this.state.buffer) {
      console.error("Buffer is empty, cannot upload file.");
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.state.buffer);
  
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer RkRDOEFBRDdFMTczRTQ2RkU4NDQ6M2pRN0xnTEl2aDNJY05TT3BHYW9WVVpWUUdUSDFEamxUOW9JeDNXbTpjaGFyYW5yYWp1'
      }
    };
  
    try {
      const response = await axios.post('https://api.filebase.io/v1/ipfs', formData, config);
      console.log("File uploaded to Filebase with CID:", response.data.cid);
      
      // Perform actions based on x
      if (x === 1) {
        console.log(`Prescription CID: ${response.data.cid}`);
        // Example: Call function to add prescription to contract
      } else if (x === 2) {
        console.log(`Report CID: ${response.data.cid}`);
        // Example: Call function to add report to contract
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
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
