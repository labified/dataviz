import * as d3 from 'd3';
import * as L from 'leaflet';
import * as React from 'react';

import './App.css';
import logo from './mindified-logo.png';
import * as secrets from './secrets.json';

type d3Selection = d3.Selection<d3.BaseType, {}, null, undefined>;

function geoTransform(map: L.Map) {
  return d3.geoTransform({
    point: function projectPoint(x: number, y: number) {
      const point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }
  });
}

const fillColor = (d: d3.ExtendedFeature): string => {
  if(d.properties) {
    switch (d.properties.category) {
      case "pickup":
        return "green";
      case "dropoff":
        return "red";
    }
  }
  return "black";
}

const renderData = (
  map: L.Map, 
  svg: d3Selection,
  g: d3Selection) => {
  d3.json("https://localhost:5001/trips")
    .then(trips => {
      const transform = geoTransform(map);
      const path = d3.geoPath().projection(transform);
      global.console.log("trips:", trips[0]);
      const geoData = { type: "FeatureCollection", features: trips } as d3.ExtendedFeatureCollection;

      const feature = g.selectAll("path")
          .data(geoData.features)
        .enter().append("path")
          .attr("fill", fillColor);

        map.on("moveend", reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
          const bounds = path.bounds(geoData);
          const topLeft = bounds[0];
          const bottomRight = bounds[1];

          const margin = 5;
          svg.attr("width", bottomRight[0] - topLeft[0] + 2 * margin)
              .attr("height", bottomRight[1] - topLeft[1] + 2 * margin)
              .style("left", `${topLeft[0] - margin}px`)
              .style("top", `${topLeft[1] - margin}px`);

          g.attr("transform", `translate(${-topLeft[0] + margin},${-topLeft[1] + margin})`);

          feature.attr("d", path);
        }
     });
};

const renderMap = () => {
  const map = L.map('mapid').setView([40.758161, -73.981927], 12);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      accessToken: secrets.mapbox,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox.streets',
      maxZoom: 18
    }).addTo(map);
  const svg = d3.select(map.getPanes().overlayPane).append("svg");
  const g = svg.append("g").attr("class", "leaflet-zoom-hide");
  renderData(map, svg, g);
};

class App extends React.Component {
  public componentDidMount() {
    renderMap();
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
