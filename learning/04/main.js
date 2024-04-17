import './style.css'
import * as d3 from "d3";
(
async function() {
  const data = await d3.csv('./data.csv');
  console.log(data);

  const width = 425;
  const height = 425;
  const xScale = d3.scaleBand()
                    .rangeRound([0, width])
                    .padding(0.1)
                    .domain(data.map(d => d.name))

  const yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, getValue)])
                    .range([height, 0])

  const barWidth = width / data.length;

  const chart = d3.select('.chart')
    .attr('width', width)
    .attr('height', height)

  const bar = chart.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', (data, index) => `translate(${xScale(data.name)}, 0)`)

  bar.append('rect')
  .attr('y', data => yScale(data.value))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - yScale(d.value))

  bar.append('text')
    .attr('x', (xScale.bandwidth()) * 0.5)
    .attr('y', data => yScale(data.value) + 5)
    .attr('dy', '0.75em')
    .text(getValue)

    function getValue(d, i) {
      return +d.value
    }

}
)();