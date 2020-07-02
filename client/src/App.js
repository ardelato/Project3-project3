import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import NavigationBar from "./components/Navbar";
import ToyList from "./pages/ToyList";
import Toy from "./pages/Toy";
import EditToy from "./components/EditToy";
import CreateToy from "./components/CreateToy";
import UserIdentification from "./pages/UserIdentification";
import SavedToyList from "./pages/SaveToy";
import LogInNav from "./components/LogInNav";
import CarouselSlider from "./components/CarouselSlider";
import axios from "axios";
import SignedInNav from "./components/SignedInNav";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      userid: null,
      firstName: null
    };
  }

  componentDidMount = () => {
    this.getUser();
  };

  updatedUser = userObject => {
    this.setState(userObject);
  };

  getUser = () => {
    axios.get("/user/login").then(response => {
      console.log("Get user response: ");
      console.log(response.data);
      if (response.data._id) {
        console.log("Get User: There is a user saved in the server session: ");

        this.setState(state => ({
          loggedIn: true,
          userid: response.data._id
        }));
      } else {
        console.log("Get user: no user");
        this.setState({
          loggedIn: false,
          userid: null,
          firstName: null
        });
      }
    });
  };

  kickUser = () => {
    console.log("Going to log out user");
    axios
      .get("/user/logout")
      .then(res => {
        this.updatedUser({
          loggedIn: false,
          userid: null,
          firstName: null
        });
        console.log("You have logged out");
      })
      .catch(error => console.log("Loggout error"));
  };

  render() {
    console.log("app render " + this.state.firstName);
    return (
      <Router>
        <div className="container">
          {this.state.loggedIn ? (
            <SignedInNav
              firstName={this.state.firstName}
              kickUser={this.kickUser}
            />
          ) : (
            <LogInNav updatedUser={this.updatedUser} />
          )}

          <NavigationBar />
          <CarouselSlider />
          <br />
          <Route path="/" exact component={ToyList} />
          <Route path="/toys" exact component={ToyList} />
          <Route path="/toys/update" component={EditToy} />
          <Route path="/toys/add" component={CreateToy} />
          <Route
            path="/user/add"
            render={props => (
              <UserIdentification {...props} updatedUser={this.updatedUser} />
            )}
          />
          {/* <Route path="/savedtoys" component={SavedToyList} /> */}
          <Route path="/toy" component={Toy} />
        </div>
      </Router>
    );
  }
}

export default App;
