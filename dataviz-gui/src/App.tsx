import * as L from 'leaflet';
import * as React from 'react';

import './App.css';
import logo from './mindified-logo.png';
import * as secrets from './secrets.json';

class App extends React.Component {
  public componentDidMount() {
    const mymap = L.map('mapid').setView([40.758161, -73.981927], 12);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      accessToken: secrets.mapbox,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox.streets',
      maxZoom: 18
    }).addTo(mymap);
  }
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div id="mapid" />
      </div>
    );
  }
}

export default App;
