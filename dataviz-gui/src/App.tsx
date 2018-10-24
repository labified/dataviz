import * as d3 from 'd3';
import * as React from 'react';

import './App.css';

import logo from './logo.svg';

interface IParsedRow {
  name: string
  value: number
}

const convertRow =  (d: d3.DSVRowString):IParsedRow  =>  {
  return {name: d.name || "", value: +(d.value || 0)}
};

const renderChart = (
  barHeight: number, 
  scaler: d3.ScaleLinear<number, number>, 
  chart: d3.Selection<d3.BaseType, {}, HTMLElement, any>) =>
    (data: d3.DSVParsedArray<IParsedRow>) => {
      scaler.domain([0, d3.max(data.map(d => d.value)) || 0]);
      chart.attr("height", barHeight * data.length);
      const bar = chart.selectAll("g")
          .data(data)
        .enter().append("g")
          .attr("transform", (d, i) => `translate(0, ${i * barHeight})`);
      bar.append("rect")
        .attr("width", d => scaler(d.value))
        .attr("height", barHeight - 1)
        .style("fill", "steelblue");
      bar.append("text")
        .attr("x", d => scaler(d.value) - 3)
        .attr("y", barHeight / 2)
        .attr("dy", ".33em")
        .style("text-anchor", "end")
        .style("fill", "white")
        .text(d => d.value);
    };

class App extends React.Component {
  public componentDidMount() {
    const width = 420;
    const barHeight = 20;
    const chart = d3.select("#chart")
        .attr("width", width);
    const scaler = d3.scaleLinear().range([0, width]);
    d3.csv("data.csv", convertRow).then(renderChart(barHeight, scaler, chart));
  }
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <section style={{textAlign: "left"}} >
          <svg id="chart" />
        </section>
      </div>
    );
  }
}

export default App;
