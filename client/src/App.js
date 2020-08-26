import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Redirect } from "react-router-dom";

import NavigationBar from "./components/Navbar";
import ToyList from "./pages/ToyList";
import Toy from "./pages/Toy";
import EditToy from "./components/EditToy";
import UserListingPage from "./pages/UserListingPage";
import UserIdentification from "./pages/UserIdentification";
import SavedToyList from "./pages/SaveToy";
import LogInNav from "./components/LogInNav";
import CarouselSlider from "./components/CarouselSlider";
import axios from "axios";
import SignedInNav from "./components/SignedInNav";
import AboutUs from "./pages/AboutUs";
import SearchResults from "./pages/searchresults";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      userid: null,
      firstName: null,
      toys: [],
      query: ""
    };
  }

  componentDidMount = () => {
    this.getUser();
  };

  handleSubmit = () => {
    if (this.state.query) {
      axios
        .get(`/find/${this.state.query}`)
        .then(response => {
          this.setState({ toys: response.data });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      alert("Please enter some search text!");
    }
  };

  updatedUser = userObject => {
    this.setState(userObject);
  };

  getUser = () => {
    axios.get("/user/login").then(response => {
      if (response.data._id) {
        this.setState(state => ({
          loggedIn: true,
          userid: response.data._id,
          firstName: response.data.firstName
        }));
      } else {
        this.setState({
          loggedIn: false,
          userid: null,
          firstName: null
        });
      }
    });
  };

  kickUser = () => {
    axios
      .get("/user/logout")
      .then(res => {
        this.updatedUser({
          loggedIn: false,
          userid: null,
          firstName: null
        });
        window.location = "/";
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <Router>
        <div className="container">
          {this.state.loggedIn ? (
            <SignedInNav
              firstName={this.state.firstName}
              userid={this.state.userid}
              kickUser={this.kickUser}
            />
          ) : (
            <LogInNav updatedUser={this.updatedUser} />
          )}

          <NavigationBar
            onChange={event => this.setState({ query: event.target.value })}
            query={this.state.query}
            clickHandler={this.handleSubmit}
            onKeyPress={event => {
              if ("Enter" === event.key) {
                this.handleSubmit();
              }
            }}
          />

          <CarouselSlider />
          <br />
          {this.state.toys.length > 0 && (
            <Redirect
              to={{
                pathname: "/results",
                state: { results: this.state.results }
              }}
            />
          )}

          <Route
            path="/"
            exact
            render={props => <ToyList {...props} userid={this.state.userid} />}
          />

          <Route
            path="/results"
            exact
            component={props => (
              <SearchResults
                {...props}
                userid={this.state.userid}
                query={this.state.query}
              />
            )}
          />

          <Route
            path="/toys"
            exact
            render={props => <ToyList {...props} userid={this.state.userid} />}
          />
          <Route path="/toys/update" component={EditToy} />
          <Route path="/aboutUs" component={AboutUs} />
          <Route
            path="/toys/add"
            render={props => (
              <UserListingPage
                {...props}
                userid={this.state.userid}
                firstName={this.state.firstName}
              />
            )}
          />
          <Route
            path="/user/add"
            render={props => (
              <UserIdentification {...props} updatedUser={this.updatedUser} />
            )}
          />
          <Route
            path="/savedtoys"
            render={props => (
              <SavedToyList {...props} userid={this.state.userid} />
            )}
          />
          {/* <Route path="/toy" render={props => (<Toy {...props} userid={this.state.userid} />)} /> */}
          <Route path="/toy" component={Toy} />
        </div>
      </Router>
    );
  }
}

export default App;
