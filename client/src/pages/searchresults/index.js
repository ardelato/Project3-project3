import React, { Component } from "react";
import axios from "axios";
import ToyCard from "../../components/ToyCard";
import { CardDeck } from "react-bootstrap";

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchtoys: []
    };
  }

  componentWillReceiveProps(props) {
    // console.log("this is search results render");
    // console.log(props);
    // axios.get("/find:query").then(response => {
    //   this.setState({ searchtoys: response.data });
    // });
  }

  render() {
    console.log("Search Results");
    console.table(this.state.searchtoys);
    console.log(this.props.toys);
    return (
      <div>
        <CardDeck>
          {this.props.toys.length > 0 ? (
            this.props.toys.map((toy, index) => {
              return <ToyCard currenttoy={toy} key={index} />;
            })
          ) : (
            <div>Loading .....</div>
          )}
        </CardDeck>
      </div>
    );
  }
}

export default SearchResults;
