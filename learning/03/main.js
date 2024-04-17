import './style.css'
import * as d3 from "d3";
(
async function() {
  // const data = await (await d3.csv('./data.csv')).map(d => +d.value)
  const data = await d3.csv('./data.csv');
  console.log(data);

  // const data = [8, 15, 16, 23, 42, 4];
  const width = 420;
  const barHiehgt = 20;
  const xWidth = d3.scaleLinear()
                    .domain([0, d3.max(data, getValue)])
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
    .attr('width', data => xWidth(data.value))
    .attr('height', barHiehgt - 1)

  bar.append('text')
    .attr('x', data => xWidth(data.value) - 3)
    .attr('y', `${(barHiehgt - 1) * 0.5}`)
    .attr('dy', '0.35em')
    .text(getValue)

    function getValue(d, i) {
      return +d.value
    }

}
)();