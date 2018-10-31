import * as d3 from 'd3';
import * as L from 'leaflet';
import * as React from 'react';

import './App.css';
import logo from './mindified-logo.png';
import * as secrets from './secrets.json';

interface IParsedRow extends d3.DSVRowAny {
  index: number,
  id: string,
  vendor_id: number,
  pickup_datetime: Date,
  dropoff_datetime: Date,
  passenger_count: number,
  pickup_longitude: number,
  pickup_latitude: number,
  dropoff_longitude: number,
  dropoff_latitude: number,
  store_and_fwd_flag: boolean,
  trip_duration: number
}

const parseRows = (row: d3.DSVRowString) : IParsedRow => {
  return {
    index: +(row.index || 0),
    id: row.id || "",
    vendor_id: +(row.vendor_id || 0),
    pickup_datetime: new Date(row.pickup_datetime || 0),
    dropoff_datetime: new Date(row.dropoff_datetime || 0),
    passenger_count: +(row.passenger_count || 0),
    pickup_longitude: +(row.pickup_longitude || 0),
    pickup_latitude: +(row.pickup_latitude || 0),
    dropoff_longitude: +(row.dropoff_longitude || 0),
    dropoff_latitude: +(row.dropoff_latitude || 0),
    store_and_fwd_flag: (row.store_and_fwd_flag || 'N') === 'Y',
    trip_duration: +(row.trip_duration || 0)
  };
};

function geoTransform(map: L.Map) {
  return d3.geoTransform({
    point: function projectPoint(x: number, y: number) {
      const point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }
  });
}

const toGeoJsonFeatures = (row: IParsedRow): GeoJSON.Feature[] => {
  return [
    {
      type: "Feature",
      geometry: {
          coordinates: [row.pickup_longitude, row.pickup_latitude],
          type: "Point"
      },
      id: row.index,
      properties: {category: "pickup"}
    },
    {
      type: "Feature",
      geometry: {
          coordinates: [row.dropoff_longitude, row.dropoff_latitude],
          type: "Point"
      },
      id: row.index,
      properties: {category: "dropoff"}
    }
  ];
};

const flatten = (array: any[][]): any[] => [].concat.apply([], array);

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
  d3.csv("train_1000.csv", parseRows)
    .then(trips => {
      const transform = geoTransform(map);
      const path = d3.geoPath().projection(transform);
      
      const geoData = { type: "FeatureCollection", features: flatten(trips.map(toGeoJsonFeatures)) } as d3.ExtendedFeatureCollection;

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
          svg .attr("width", bottomRight[0] - topLeft[0] + 2 * margin)
              .attr("height", bottomRight[1] - topLeft[1] + 2 * margin)
              .style("left", `${topLeft[0] - margin}px`)
              .style("top", `${topLeft[1] - margin}px`);

          g   .attr("transform", `translate(${-topLeft[0] + margin},${-topLeft[1] + margin})`);

          feature.attr("d", path);
        }
     });
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
