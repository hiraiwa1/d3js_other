import './style.css'
import * as d3 from "d3";

// d3.select('body')
//   .style('background-color', `tomato`)
//   .transition()
//   .duration(3000)
//   .style('background-color', `#333`)

// d3.selectAll('p')
//   // .style('color', `hsl(${Math.random() * 360}, 100%, 50%)`)
//   .style('color', (data, index) => index % 2 ? 'white' : `hsl(${Math.random() * 360}, 100%, 50%)`)
//   .style('font-size', '8px')
//   .data([8, 11, 14, 24, 36, 42])
//   .transition()
//   .delay((d, index) => index * 205)
//   .duration(1000)
//   .ease(d3.easePolyInOut)
//   .style('font-size', d => `${d}px`)

// const p = d3.select('#app')
//   .selectAll('p');

// p.data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
// .enter()
// .append('p')
// .text((d, index) => `chenged ${index + 1}`)
// .exit()
// .remove()

// p.data([11, 12, 13, 14, 15, 16, 17])
//   .enter()
//   .append('p')
//   .text((d, i) => `updated ${d}`);

const data = [8, 15, 16, 23, 42, 4];
const width = 420;
const xWidth = d3.scaleLinear()
  .domain([0, d3.max(data)])
  .range([0, width])

d3.select('.chart')
  .selectAll('div')
  .data(data)
  .enter()
  .append('div')
  // .style('width', d => `${d * 10}px`)
  .style('width', d => `${xWidth(d)}px`)
  .text(d => d)