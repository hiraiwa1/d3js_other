import './style.css'
import * as d3 from 'd3';

const dataset = [
  { "name": "A", "value": 5, "color": "#dc3912" },
  { "name": "B", "value": 6, "color": "#3366cc" },
  { "name": "C", "value": 8, "color": "#109618" },
  { "name": "D", "value": 1, "color": "#ff9900" },
  { "name": "E", "value": 2, "color": "#990099" },
  { "name": "F", "value": 6, "color": "#dc3912" },
  { "name": "G", "value": 8, "color": "#3366cc" },
  { "name": "H", "value": 6, "color": "#109618" },
  { "name": "I", "value": 10, "color": "#ff9900" },
  { "name": "J", "value": 9, "color": "#990099" }
];

const width = 600;
const height = 400;
const padding = 10;
const radius = Math.min(width, height) / 2 - padding;

const svg = d3.select('#app')
              .append('svg')
              .attr('width', width)
              .attr('height', height)

const g = svg.append('g')
              .attr('transform', `translate(${width / 2}, ${height / 2})`)

const color = d3.scaleOrdinal()
                .range(dataset.map(d => d.color))

const pie = d3.pie()
              .value(d => d.value)
              .sort(null)

const pieGroup = g.selectAll('.pie')
                  .data(pie(dataset))
                  .enter()
                  .append('g')
                  .attr('class', 'pie')

const arc = d3.arc()
              .outerRadius(radius)
              .innerRadius(radius - radius + 100);

const path = pieGroup.append('path')
        .attr('fill', d => color(d.index))
        // .attr('opacity', 0.75)
        .attr('stroke', 'white')

const textRadius = d3.arc()
                .outerRadius(radius - 30)
                .innerRadius(radius - 30)


const text = pieGroup.append('text')
        .attr('fill', '#333')
        .attr('transform', d => `translate(${textRadius.centroid(d)})`)
        .attr('dy', '5pt')
        .attr('font', '1em')
        .attr('text-anchor', 'middle')
        .text(d => d.data.name)
        .style('opacity', 0)

createObserver(document.querySelector('#app'))

function createObserver(boxElement) {
  let observer;

  let options = {
    root: null,
    rootMargin: "0px",
    threshold: [0, 0.5, 1],
  };

  observer = new IntersectionObserver(handleIntersect, options);
  observer.observe(boxElement);

}
function handleIntersect(entries, observer) {
  entries.forEach((entry) => {

    path.transition()
            .duration(1000)
            .delay((d, i) => i * 50)
            .ease(d3.easeLinear)
            .attr('d', arc)

    text.transition()
        .duration(800)
        .delay((d, i) => i * 50)
        .ease(d3.easeLinear)
        .style('opacity', 1)

    observer.unobserve(entry.target);
  });
}
