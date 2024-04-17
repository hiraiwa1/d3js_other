import './style.css'
import * as d3 from "d3";

const data = [8, 15, 16, 23, 42, 4];
const width = 420;
const barHiehgt = 20;
const xWidth = d3.scaleLinear()
  .domain([0, d3.max(data)])
  .range([0, width])

const chart = d3.select('.chart')
  .attr('width', width)
  .attr('height', data.length * barHiehgt)

const bar = chart.selectAll('g')
  .data(data)
  .enter()
  .append('g')
  .attr('transform', (data, index) => `translate(0, ${barHiehgt * index})`)

bar.append('rect')
  .attr('width', data => xWidth(data))
  .attr('height', barHiehgt - 1)

bar.append('text')
  .attr('x', data => xWidth(data) - 3)
  .attr('y', `${(barHiehgt - 1) * 0.5}`)
  .attr('dy', '0.35em')
  .text(data => data)