import './style.css'
import * as d3 from "d3";
import * as topojson from "topojson-client";

async function main() {

  const util = {
    width: 975,
    height: 610
  }
  const us = await d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json');
  console.log(us);


  const zoom = d3.zoom()
                .scaleExtent([1, 8])
                .on('zoom', zoomed)


  const svg = d3.select('#app').append("svg")
                .attr('viewBox', [0, 0, util.width, util.height])
                .attr('width', '630')
                .attr('height', '460')
                .attr('style', 'max-width: 100%; height: auto;')
                .on('click', reset)

  const path = d3.geoPath();

  const g = svg.append('g');

  const states = g.append('g')
                  .attr('fill', '#444')
                  .attr('cursor', 'pointer')
                  .selectAll('path')
                  .data(topojson.feature(us, us.objects.states).features)
                  .join('path')
                  .on('click', clicked)
                  .attr('d', path)

  states.append('title')
        .text(d => d.properties.name);

  g.append('path')
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-linejoin', 'round')
    .attr('d', path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)))

  svg.call(zoom)


  function clicked(event, pointData) {
    if(d3.select('.text-layer')._groups[0].length > 0) d3.select('.text-layer').remove()

    console.log(event, pointData);
    const [[x0, y0], [x1, y1]] = path.bounds(pointData)
    event.stopPropagation();
    states.transition()
          .style('fill', null);

    d3.select(this)
      .transition()
      .style('fill', 'tomato')

    svg.transition()
        .duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity
            .translate(util.width / 2, util.height/ 2)
            .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / util.width, (y1 - y0) / util.height)))
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
          d3.pointer(event, svg.node())
        )

    const topLaayer = svg.append('g')
                          .attr('class', 'text-layer')

    topLaayer.append('rect')
            .attr('width', '580')
            .attr('height', '400')
            .style('fill', 'rgba(255, 255, 255, 0.3)')
            .attr('x', 180)
            .attr('y', 140)

    topLaayer.append('text')
              .text(pointData.id)
              .attr('x', '0')
              .attr('y', '0')
              .attr('transform', 'translate(325, 430)')
              .style('font-size', '200pt')
              .style('font-weight', 'bold')
              .style('fill', 'green')

    topLaayer.on('click', reset)

  }

  function reset() {
    states.transition()
          .style('fill', null)

    svg.transition()
        .duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity,
          d3.zoomTransform(svg.node())
            .invert([util.width / 2, util.height / 2])
        )

    if(d3.select('.text-layer')._groups[0].length > 0) d3.select('.text-layer').remove()
  }

  function zoomed(event) {
    const { transform } = event;

    g.attr('transform', transform)
    g.attr('stroke-width', 1 / transform.k)
  }
}



main();