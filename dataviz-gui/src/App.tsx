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
  height: number,
  y: d3.ScaleLinear<number, number>,
  x: d3.ScaleBand<string>,
  chart: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
  xAxis: d3.Axis<string>,
  yAxis: d3.Axis<number | {valueOf(): number}>) =>
  (data: d3.DSVParsedArray<IParsedRow>) => {
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
    const margin = {top: 20, right: 30, bottom: 30, left: 40};
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const y = d3.scaleLinear().range([height, 0]);
    const x = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);
    const chart = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    d3.csv("data.csv", convertRow).then(renderChart(height, y, x, chart, xAxis, yAxis));
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
