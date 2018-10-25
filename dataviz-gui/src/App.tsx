import * as d3 from 'd3';
import * as React from 'react';

import './App.css';

import logo from './logo.svg';

const chartSize = {width: 960, height: 500};

interface IParsedRow {
  name: string
  value: number
}

const convertRow =  (d: d3.DSVRowString):IParsedRow  =>  {
  return {name: d.name || "", value: +(d.value || 0)}
};

const renderChart = (data: d3.DSVParsedArray<IParsedRow>) => {
  const margin = {top: 20, right: 30, bottom: 30, left: 40};
  const width = chartSize.width - margin.left - margin.right;
  const height = chartSize.height - margin.top - margin.bottom;
  const y = d3.scaleLinear().range([height, 0]);
  const x = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);
  const chart = d3.select("#chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  x.domain(data.map(d => d.name));
  y.domain([0, d3.max(data, d => d.value) || 0]);
  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
  chart.append("g")
    .attr("class", "y axis")
    .call(yAxis);
  chart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.name) || 0)
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.value))
      .style("fill", "steelblue");
};

class App extends React.Component {
  public componentDidMount() {
    d3.csv("data.csv", convertRow).then(renderChart);
  }
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <section style={{textAlign: "left"}} >
          <svg id="chart" width={chartSize.width} height={chartSize.height} />
        </section>
      </div>
    );
  }
}

export default App;
