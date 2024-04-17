import './style.css'
import * as d3 from "d3";
(
async function() {
  const dataset = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12]
  ]

  const color = d3.scaleLinear()
                  .domain([1, 12])
                  .range(['steelblue', 'tomato'])
console.log(color(6))

  d3.select('#app')
    .append('table')
    .attr('border', 1)
    .style('border-collapse', 'collapse')
    .append('tbody')
    .selectAll('tr')
    .data(dataset)
    .enter()
    .append('tr')
    .selectAll('td')
    .data(row => row)
    .enter()
    .append('td')
    .style('text-align', 'center')
    .style('background-color', d => color(d))
    .text(d => d)

    const color2 = d3.scaleLinear([0, 100], ["red", "blue"])
    console.log(color2(100));

}
)();