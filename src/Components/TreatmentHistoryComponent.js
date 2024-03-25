import React, { Component } from "react";
import moment from "moment";
import "./HistoryComp.css";

const ETHER = 1000000000000000000;

function AllEventrender({ treatEv, contract, accounts }) {
  const getTimeFormat = (timeCreated) => {
    let day = moment.unix(timeCreated);
    let xy = timeCreated;
    let date = new Date(xy * 1000);
    let time = day.format("MMMM Do, YYYY [at] h:mm A");
    return time;
  };
  let DeSale = "plotDeSale";
  return (
    <div className="eventbox">
      {treatEv?.event === "PrescriptionAddedTreat" ||
      treatEv?.event === "ReportAddedTreat" ? (
        <a
          href={`https://ipfs.io/ipfs/${
            treatEv?.returnValues.report || treatEv?.returnValues.prescription
          }`}
          target="_blank"
        >
          <img
            style={{ "max-width": "90%" }}
            src={`https://ipfs.io/ipfs/${
              treatEv?.returnValues.report || treatEv?.returnValues.prescription
            }`}
          />
        </a>
      ) : null}
      <h6>Event: {treatEv?.event}</h6>
      <p>
        {treatEv?.event === "doctorAddedTreat" ? (
          <p>Doctor: {treatEv?.returnValues.docAadhar}</p>
        ) : null}
      </p>
      <p>
        {treatEv?.event === "PrescriptionAddedTreat" ? (
          <p style={{ "word-wrap": "break-word" }}>
            Prescription: {treatEv?.returnValues.prescription}
          </p>
        ) : null}
      </p>
      <p>
        {treatEv?.event === "ReportAddedTreat" ? (
          <p style={{ "word-wrap": "break-word" }}>
            Report: {treatEv?.returnValues.report}
          </p>
        ) : null}
      </p>
      <p>Time: {getTimeFormat(treatEv.returnValues.times)}</p>
      <br />
    </div>
  );
}

class TreatmentHistoryComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treatment: null,
      treatmentEvents: [],
    };
  }

  async componentDidMount() {
    var rex = await this.props.contract?.methods
      .treatments(this.props.matchId)
      .call();
    this.setState({ treatment: rex });
    //console.log(this.props.plotAddedEvents);

    let treatmentEvents = [];
    this.props.treatAdded.map((property) => {
      treatmentEvents.push(property);
    });
    this.props.doctorAddedTreat.map((property) => {
      treatmentEvents.push(property);
    });
    this.props.PrescriptionAddedTreat.map((property) => {
      treatmentEvents.push(property);
    });
    this.props.ReportAddedTreat.map((property) => {
      treatmentEvents.push(property);
    });
    treatmentEvents.sort((a, b) => {
      return a.returnValues.times - b.returnValues.times;
    });
    console.log("events", treatmentEvents);
    this.setState({ treatmentEvents });
    console.log(this.state.treatmentEvents);
  }

  render() {
    const Menu = this.state.treatmentEvents.map((x) => {
      return (
        <div key={x.id} className="events">
          <AllEventrender
            treatEv={x}
            contract={this.props.contract}
            accounts={this.props.accounts}
          />
          <br />
          <br />
        </div>
      );
    });

    return (
      <div className="body_style">
        <br />
        <h2>Treatment History</h2>
        <br />
        <i className="fa fa-medkit fa-5x plotimage"></i>
        <div className="details">
          <p>
            <span className="column1">Treatment ID</span>{" "}
            <span className="column2">
              : {this.state.treatment?.treatment_Id}
            </span>
          </p>
          <p>
            <span className="column1">Patient Aadhar</span>{" "}
            <span className="column2">
              : {this.state.treatment?.patientAadhar}
            </span>
          </p>
          <p>
            <span className="column1">Admin Aadhar</span>{" "}
            <span className="column2">
              : {this.state.treatment?.adminAadhar}
            </span>
          </p>
        </div>
        <hr />
        <h2>Events</h2>
        <br />
        <div className="eventrow">{Menu}</div>
        <br />
        <br />
      </div>
    );
  }
}

export default TreatmentHistoryComp;
