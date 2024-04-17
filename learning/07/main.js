import './style.css'
import * as d3 from "d3";
(
async function() {
  const dataset = [
    { "name": "A", "value": 5 },
    { "name": "B", "value": 6 },
    { "name": "C", "value": 8 },
    { "name": "D", "value": 1 },
    { "name": "E", "value": 2 },
    { "name": "F", "value": 6 },
    { "name": "G", "value": 8 },
    { "name": "H", "value": 6 },
    { "name": "I", "value": 10 },
    { "name": "J", "value": 9 }
  ]

  const config = {
    width: 400,
    height: 300,
  }
  const radius = (Math.min(config.width, config.height) / 2) - 10;

  const svg = d3.select('#app')
                .append('svg')
                .attr('width', config.width)
                .attr('height', config.height)
                .attr('viewBox', `0 0 ${config.width} ${config.height}`)

  const g = svg.append('g')
                .attr('transform', `translate(${config.width / 2}, ${config.height / 2})`)


  const color = d3.scaleOrdinal()
                  .range(["#DC3912", "#3366CC", "#109618", "#FF9900", "#990099"])

  const pie = d3.pie()
                .value(d => d3.value)
                .sort(null)

  const pieGroup = g.selectAll('.pie')
                    .data(pie(dataset))
                    .enter()
                    .append('g')
                    .attr('class', 'pie')

  const arc = d3.arc()
                .outerRadius(radius)
                .innerRadius(radius / 3)

  pieGroup.append('path')
          .attr('d', arc)
          .attr('fill', (d, index) => color(index))
          .attr('opacity', 0.75)
          .attr('stroke', 'white')

  const text = d3.arc()
                  .outerRadius(radius - 30)
                  .innerRadius(radius - 30)

  pieGroup.append('text')
          .attr('fill', '#333')
          .attr('transform', d => `translate(${text.centroid(d)})`)
          .attr('dy', 5)
          .attr('font', '10px')
          .attr('text-anchor', 'middle')
          .text(d => d.data.name)

}
)();