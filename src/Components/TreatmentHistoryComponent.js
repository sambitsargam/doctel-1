import React, { Component } from "react";
import moment from "moment";
import "./HistoryComp.css";
import axios from "axios";

// Filebase credentials
const USERNAME = "charanraju";
const PASSWORD = "RkRDOEFBRDdFMTczRTQ2RkU4NDQ6M2pRN0xnTEl2aDNJY05TT3BHYW9WVVpWUUdUSDFEamxUOW9JeDNXbTpjaGFyYW5yYWp1";

function AllEventrender({ treatEv }) {
  const getTimeFormat = (timeCreated) => {
    let day = moment.unix(timeCreated);
    let date = new Date(timeCreated * 1000);
    let time = day.format("MMMM Do, YYYY [at] h:mm A");
    return time;
  };

  const getFileUrl = async (hash) => {
    try {
      const response = await axios.get(`https://api.filebase.io/v1/ipfs/${hash}`, {
        auth: {
          username: USERNAME,
          password: PASSWORD
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching file from Filebase IPFS Pinning Service:", error);
      return null;
    }
  };

  return (
    <div className="eventbox">
      {(treatEv?.event === "PrescriptionAddedTreat" || treatEv?.event === "ReportAddedTreat") && (
        <a href={getFileUrl(treatEv?.returnValues.report || treatEv?.returnValues.prescription)} target="_blank" rel="noopener noreferrer">
          <img
            style={{ maxWidth: "90%" }}
            src={getFileUrl(treatEv?.returnValues.report || treatEv?.returnValues.prescription)}
            alt="Document"
          />
        </a>
      )}
      <h6>Event: {treatEv?.event}</h6>
      {treatEv?.event === "doctorAddedTreat" && (
        <p>Doctor: {treatEv?.returnValues.docAadhar}</p>
      )}
      {treatEv?.event === "PrescriptionAddedTreat" && (
        <p style={{ wordWrap: "break-word" }}>
          Prescription: {treatEv?.returnValues.prescription}
        </p>
      )}
      {treatEv?.event === "ReportAddedTreat" && (
        <p style={{ wordWrap: "break-word" }}>
          Report: {treatEv?.returnValues.report}
        </p>
      )}
      <p>Time: {getTimeFormat(treatEv.returnValues.times)}</p>
      <br />
    </div>
  );
}

// The rest of your TreatmentHistoryComp remains the same...


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
