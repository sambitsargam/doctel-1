import React, { Component } from "react";
import { Card, CardTitle, CardBody, CardText } from "reactstrap";
import "./AllMemComponent.css";

function AllDoctorRender({ doctor }) {
  var style1 = "bg-success text-white";
  return (
    <Card className={style1} style={{ height: "18rem" }}>
      <br />
      <i className="fa fa-user fa-3x"></i>
      <CardBody>
        <CardTitle>Doctor Aadhar: {doctor?.doctorAadhar}</CardTitle>
        <CardText>
          <small>Account: {doctor?.doctorAddress}</small>
        </CardText>
        <CardText>
          <small>Role: {doctor?.speciality}</small>
        </CardText>
      </CardBody>
    </Card>
  );
}

function AllAdminRender({ admin }) {
  var style2 = "bg-primary text-white";
  if (admin) {
    return (
      <Card className={style2} style={{ height: "18rem" }}>
        <br />
        <i className="fa fa-user-secret fa-3x"></i>
        <CardBody>
          <CardTitle>Admin Aadhar: {admin.adminAadhar}</CardTitle>
          <CardText>
            <small>Account: {admin.adminAddr}</small>
          </CardText>
          <CardText>
            <small>Role: {admin.role}</small>
          </CardText>
        </CardBody>
      </Card>
    );
  } else {
    return null;
  }
}

class AllMemComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      admins: [],
    };
  }

  async componentDidMount() {
    console.log(
      "Time start members AllMemComponent componentDidMount",
      Date.now()
    );
    var resDoctorCount = await this.props.contract?.methods
      .doctorCount()
      .call();
    var responseDoctors = [];
    for (var i = 1; i <= resDoctorCount; i++) {
      var resDoctor = await this.props.contract?.methods.doctorIds(i).call();
      responseDoctors.push(resDoctor);
    }
    console.log(
      "Time end doctor AllMemComponent componentDidMount",
      Date.now()
    );
    this.setState({
      doctors: responseDoctors,
    });
    console.log(
      "Time start admin AllMemComponent componentDidMount",
      Date.now()
    );
    var resAdminCount = await this.props.contract?.methods.adminCount().call();
    var responseAdminsAddrs = [];
    for (var i = 1; i <= resAdminCount; i++) {
      var resAdmin = await this.props.contract?.methods.adminIds(i).call();
      responseAdminsAddrs.push(resAdmin);
    }
    console.log("Time end admin AllMemComponent componentDidMount", Date.now());
    this.setState({
      admins: responseAdminsAddrs,
    });
  }

  render() {
    const AllDoctors = this.state.doctors?.map((x) => {
      return (
        <div key={x.doctor_Id} className="card1">
          <AllDoctorRender doctor={x} />
        </div>
      );
    });

    const AllAdmins = this.state.admins?.map((y) => {
      return (
        <div key={y.admin_Id} className="card1">
          <AllAdminRender admin={y} />
        </div>
      );
    });

    return (
      <div>
        <br />
        <h2>All Members</h2>
        <br />
        <h4>Admins</h4>
        <br />
        <div className="row1">{AllAdmins}</div>
        <br />
        <h4 style={{ clear: "both" }}>Doctors</h4>
        <br />
        <div className="row2">{AllDoctors}</div>
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  }
}

export default AllMemComponent;
