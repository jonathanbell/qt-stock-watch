import React, { Component } from 'react';

import { Button } from 'reactstrap';

import Navigation from './components/Navigation';
import PositionsList from './components/PositionsList';
import SearchBar from './components/SearchBar';

import './css/App.css';

class App extends Component {
  state = {
    response: ''
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello-again');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className="App">
        <SearchBar />
        <PositionsList />
        <header>
          <Navigation />
          <Button color="danger">Danger!</Button>
        </header>
        <p className="App-intro">{this.state.response}</p>
      </div>
    );
  }
}

export default App;
