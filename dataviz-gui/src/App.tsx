import * as React from 'react';
import GeoMap from './GeoMap';

import './App.css';
import logo from './mindified-logo.png';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <GeoMap />
      </div>
    );
  }
}

export default App;
