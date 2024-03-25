import React, { Component } from "react";
import BNContract from "../Contracts/DocTel.json";
import getWeb3 from "../getWeb3";
import "../App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Header from "./HeaderComponent";
import Footer from "./FooterComponent";
import Home from "./HomeComponent";
import PatientComp from "./PatientComponent";
import SignUp from "./SignupComponent";
import TreatmentComp from "./TreatmentComponent";
import AllMemComponent from "./AllMemComponent";
import PatientDetailsComp from "./PatientDetailsComponent";
import AllTreatmentComponent from "./AllTreatmentComponent";
import TreatmentHistoryComp from "./TreatmentHistoryComponent";
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      balance: 0,
      contract: null,
      treatAddedEvents: [],
      doctorAddedTreatEvents: [],
      PrescriptionAddedTreatEvents: [],
      ReportAddedTreatEvents: [],
    };
    this.changeAadhar = this.changeAadhar.bind(this);
  }

  componentDidMount = async () => {
    try {
      console.log("Time start main component", Date.now());
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const balance = await web3.eth.getBalance(accounts[0]);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BNContract.networks[networkId];
      const instance = new web3.eth.Contract(
        BNContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      console.log("Time init state main component", Date.now());
      this.setState({
        web3,
        accounts: accounts[0],
        contract: instance,
        balance: balance,
      });
      localStorage.setItem("wallet", accounts[0]);
      console.log("Time start event get", Date.now());
      var treatAddedEvents = [];
      var res = await this.state.contract.getPastEvents("treatAdded", {
        fromBlock: 0,
      });
      treatAddedEvents = res;
      res = await this.state.contract.getPastEvents("doctorAddedTreat", {
        fromBlock: 0,
      });
      var doctorAddedTreatEvents = res;
      res = await this.state.contract.getPastEvents("PrescriptionAddedTreat", {
        fromBlock: 0,
      });
      var PrescriptionAddedTreatEvents = res;
      res = await this.state.contract.getPastEvents("ReportAddedTreat", {
        fromBlock: 0,
      });
      var ReportAddedTreatEvents = res;
      console.log("Time end event get", Date.now());
      this.setState({
        treatAddedEvents,
        doctorAddedTreatEvents,
        PrescriptionAddedTreatEvents,
        ReportAddedTreatEvents,
      });
      console.log("Time end main component", Date.now());
    } catch (error) {}
  };

  changeAadhar = async (aad) => {
    this.setState({ aadhar: aad });
    console.log(aad);
  };

  render() {
    const CardWithId = ({ match }) => {
      return (
        <TreatmentHistoryComp
          contract={this.state.contract}
          accounts={this.state.accounts}
          matchId={match.params.id}
          treatAdded={this.state.treatAddedEvents?.filter(
            (token) => token.returnValues.treatId === match.params.id
          )}
          doctorAddedTreat={this.state.doctorAddedTreatEvents?.filter(
            (token) => token.returnValues.treatId === match.params.id
          )}
          PrescriptionAddedTreat={this.state.PrescriptionAddedTreatEvents?.filter(
            (token) => token.returnValues.treatId === match.params.id
          )}
          ReportAddedTreat={this.state.ReportAddedTreatEvents?.filter(
            (token) => token.returnValues.treatId === match.params.id
          )}
        />
      );
    };

    return (
      <div className="App">
        <Header />
        <Switch>
          <Route
            exact
            path="/home"
            component={() => (
              <Home
                contract={this.state.contract}
                accounts={this.state.accounts}
              />
            )}
          />
          <Route
            exact
            path="/patient"
            component={() => (
              <PatientComp
                contract={this.state.contract}
                accounts={this.state.accounts}
              />
            )}
          />
          <Route
            exact
            path="/signup"
            component={() => (
              <SignUp
                contract={this.state.contract}
                accounts={this.state.accounts}
                changeAadhar={this.changeAadhar}
              />
            )}
          />
          <Route
            exact
            path="/treatment"
            component={() => (
              <TreatmentComp
                contract={this.state.contract}
                accounts={this.state.accounts}
                ipfs={ipfs}
              />
            )}
          />
          <Route
            exact
            path="/members"
            component={() => (
              <AllMemComponent
                contract={this.state.contract}
                accounts={this.state.accounts}
              />
            )}
          />
          <Route
            exact
            path="/patdata"
            component={() => (
              <PatientDetailsComp
                contract={this.state.contract}
                accounts={this.state.accounts}
              />
            )}
          />
          <Route
            exact
            path="/treat"
            component={() => (
              <AllTreatmentComponent
                contract={this.state.contract}
                accounts={this.state.accounts}
              />
            )}
          />
          <Route path="/treatment/:id" component={CardWithId} />
          <Redirect to="/home" />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default Main;
