import React, { Component } from "react";
import { Button, Alert } from "reactstrap";
import { Link } from "react-router-dom";
import "../App.css";
import "./SignupComponent.css";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: "",
      aadhar: 0,
      role: "",
      adminWallets: [],
      docAadhars: [],
      walletAddress: "",
      location: "",
      speciality: "",
      validate: <div></div>,
    };
    this.handleSubmitDoctor = this.handleSubmitDoctor.bind(this);
    this.handleSubmitAdmin = this.handleSubmitAdmin.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addingAdmin = this.addingAdmin.bind(this);
    this.addingDoctor = this.addingDoctor.bind(this);
    this.handleLogInAdmin = this.handleLogInAdmin.bind(this);
    this.handleLogInDoctor = this.handleLogInDoctor.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  handleInputChange(event) {
    event.preventDefault();
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  async handleSubmitAdmin(event) {
    event.preventDefault();
    if (this.handleValidateAdmin(this.props.accounts)) {
      this.addingAdmin();
    } else {
      let validate = (
        <div key={1}>
          <Alert color="warning" toggle={this.onDismiss} fade={false}>
            Do a login with different wallet. Account already exists
          </Alert>
        </div>
      );
      this.setState({
        validate: validate,
      });
    }
  }

  async handleSubmitDoctor(event) {
    event.preventDefault();
    console.log("Time started DoctorAdd", Date.now());
    if (this.handleValidateDoctor(this.state.aadhar)) {
      this.addingDoctor();
    } else {
      let validate = (
        <div key={1}>
          <Alert color="warning" toggle={this.onDismiss} fade={false}>
            Account with this Aadhar No. already exists. Please Login.
          </Alert>
        </div>
      );
      this.setState({
        validate: validate,
      });
    }
  }

  addingAdmin = async () => {
    console.log("Time started AdminAdd", Date.now());
    console.log(this.state.aadhar, this.state.role);
    const res = await this.props.contract.methods
      .addAdmin(this.state.aadhar, this.props.accounts, this.state.role)
      .send({ from: this.props.accounts, gas: 1000000 });
    console.log("Time ended AdminAdd", Date.now());
  };

  addingDoctor = async () => {
    console.log("Time started DoctorAdd", Date.now());
    console.log(
      this.state.aadhar,
      this.state.walletAddress,
      this.state.speciality,
      this.state.location
    );
    const res = await this.props.contract.methods
      .addDoctor(
        this.state.aadhar,
        this.state.walletAddress,
        this.state.speciality,
        this.state.location
      )
      .send({ from: this.props.accounts, gas: 1000000 });
    console.log("Time ended DoctorAdd", Date.now());
  };

  handleLogInAdmin = async (event) => {
    event.preventDefault();
    if (!this.handleValidateAdmin(this.props.accounts)) {
      localStorage.setItem("myAadhar", this.state.aadhar);
      this.props.changeAadhar(localStorage.getItem("myAadhar"));
    } else {
      let validate = (
        <div key={1}>
          <Alert color="warning" toggle={this.onDismiss} fade={false}>
            Account with this Aadhar No. does not exist. Please Signup.
          </Alert>
        </div>
      );
      this.setState({
        validate: validate,
      });
    }
  };

  handleLogInDoctor = async (event) => {
    event.preventDefault();
    if (!this.handleValidateDoctor(this.state.aadhar)) {
      localStorage.setItem("myAadhar", this.state.aadhar);
      this.props.changeAadhar(localStorage.getItem("myAadhar"));
    } else {
      let validate = (
        <div key={1}>
          <Alert color="warning" toggle={this.onDismiss} fade={false}>
            Account with this Aadhar No. does not exist. Please Signup.
          </Alert>
        </div>
      );
      this.setState({
        validate: validate,
      });
    }
  };

  handleLogOut = async (event) => {
    event.preventDefault();
    let y = localStorage.setItem("myAadhar", 0);
    this.props.changeAadhar(localStorage.getItem("myAadhar"));
  };

  handleValidateAdmin = (wallet) => {
    if (this.state.adminWallets.includes(wallet.toString())) {
      return false;
    } else {
      return true;
    }
  };

  handleValidateDoctor = (aadhar) => {
    if (this.state.docAadhars.includes(aadhar.toString())) {
      return false;
    } else {
      return true;
    }
  };
  onDismiss = () => this.setState({ validate: <div></div> });

  async componentDidMount() {
    console.log("Time started AdminFetch", Date.now());
    var resAdminCount = await this.props.contract?.methods.adminCount().call();
    var responseAdminsWallets = [];
    for (var i = 1; i <= resAdminCount; i++) {
      var resAdmin = await this.props.contract?.methods.adminIds(i).call();
      responseAdminsWallets.push(resAdmin);
    }
    let adWallets = responseAdminsWallets.map((ele) => {
      return ele.adminAddr;
    });
    console.log("Time ended AdminFetch", Date.now());
    console.log("Time started DoctorFetch", Date.now());
    var resDoctorCount = await this.props.contract?.methods
      .doctorCount()
      .call();
    var responseDoctors = [];
    for (var i = 1; i <= resDoctorCount; i++) {
      var resDoctor = await this.props.contract?.methods.doctorIds(i).call();
      responseDoctors.push(resDoctor);
    }

    let doctorAads = responseDoctors.map((ele) => {
      return ele.doctorAadhar;
    });
    console.log("Time ended DoctorFetch", Date.now());
    this.setState({
      adminWallets: adWallets,
      docAadhars: doctorAads,
    });
    console.log(this.state.adminWallets, this.state.docAadhars);
  }

  render() {
    return (
      <React.Fragment>
        <h1 className="head">SignUp Page</h1>
        <div className="row">{this.state.validate}</div>
        <div className="fullbox">
          <div className="box1">
            <h6 className="heading-style">Admin</h6>
            <div className="sub-box1">
              <i
                className="fa fa-user-circle-o fa-4x"
                aria-hidden="true"
                style={{ paddingBottom: "5%" }}
              ></i>
              <br />
              <div className="p-2">
                <label className="label1"> Aadhar Number: </label>
                <br />
                <input
                  className="input1"
                  type="number"
                  name="aadhar"
                  placeholder="Enter Aadhar Number"
                  onChange={this.handleInputChange}
                  required
                />
              </div>

              <div className="p-2">
                <label className="label1"> Role: </label>
                <br />
                <input
                  className="input1"
                  type="text"
                  name="role"
                  placeholder="Enter Role"
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <button
                className="signup-btn btn btn-block btn-sm btn-primary text-uppercase pl-3 pr-3"
                type="submit"
                onClick={this.handleSubmitAdmin}
              >
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Sign Up
                </Link>
              </button>
              <Button
                className="allbtn btn1"
                type="submit"
                onClick={this.handleLogInAdmin}
              >
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Log In
                </Link>
              </Button>
              <Button
                className="allbtn"
                type="submit"
                onClick={this.handleLogOut}
              >
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Log Out
                </Link>
              </Button>
            </div>
          </div>
          <div className="box2">
            <h6 className="heading-style">Doctor</h6>
            <div className="sub-box2">
              <i
                className="fa fa-users fa-4x"
                aria-hidden="true"
                style={{ paddingBottom: "5%" }}
              ></i>
              <br />
              <div className="p-2">
                <label className="label1">Wallet Address: </label>
                <br />
                <input
                  className="input1"
                  type="text"
                  name="walletAddress"
                  placeholder="Enter walletAddress"
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div className="p-2">
                <label className="label1"> Aadhar Number: </label>
                <br />
                <input
                  className="input1"
                  type="number"
                  name="aadhar"
                  placeholder="Enter Aadhar Number"
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div className="p-2">
                <label className="label1"> Speciality: </label>
                <br />
                <input
                  className="input1"
                  type="text"
                  name="speciality"
                  placeholder="Enter Speciality"
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div className="p-2">
                <label className="label1"> Location: </label>
                <br />
                <input
                  className="input1"
                  type="text"
                  name="location"
                  placeholder="Enter Location"
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <button
                className="signup-btn btn btn-block btn-sm btn-primary text-uppercase pl-3 pr-3"
                type="submit"
                onClick={this.handleSubmitDoctor}
              >
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Sign Up
                </Link>
              </button>
              <Button
                className="allbtn btn1"
                type="submit"
                onClick={this.handleLogInDoctor}
              >
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Log In
                </Link>
              </Button>
              <Button
                className="allbtn"
                type="submit"
                onClick={this.handleLogOut}
              >
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Log Out
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SignUp;
