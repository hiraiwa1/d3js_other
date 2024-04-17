import * as d3 from "d3";
import { useEffect } from "react";
import * as topojson from "topojson-client";

export const Map = (props) => {
  const { csvData } = props;
  console.log(csvData);
  let svg = null;
  let mapG = null;

  const warningColor = d3.scaleLinear()
  .domain([0, 1])
  .range(["hsl(0, 100%, 90%)", "hsl(0, 100%, 40%)"])

  const watchColor = d3.scaleLinear()
  .domain([0, 1])
  .range(["#d4ffcc", "#99ff00"])

  useEffect(() => {

    if(csvData.length === 0) return;

    const color = (id) => {
      const d = csvData.find(d => d.id === id);

      if(d.warningRate > 0) return warningColor(d.warningRate)
      else if(d.watchRate > 0) return watchColor(d.watchRate)

      return '#ddd'
    }

    createSvg(color)

  }, [csvData])

  const createSvg = async (color) => {
    const japan = await d3.json('https://unpkg.com/jpn-atlas@1/japan/japan.json')


    svg = d3.select('#map')
                    .append('svg')
                    .attr('viewBox', [0, 0, 850, 680])
                    .attr('width', 850)
                    .attr('height', 680)
                    .style('background', 'lightskyblue')

    mapG = svg.append('g')
                    .attr('class', 'map-path')
                    .attr('transform', 'translate(0, 30)')

    const path = d3.geoPath()

    mapG.selectAll('path')
      .data(topojson.feature(japan, japan.objects.prefectures).features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('stroke', '#666')
      .attr('stroke-width', 1)
      .attr('fill', data => color(data.id))
      .on('click', (event, mapD) => {
        console.log(event);
        const data = csvData.find(d => d.id === mapD.id);
        console.log(data);
        eventSvg(data)
      })
  }

  const eventSvg = (data) => {
    if(svg.selectAll('text')._groups[0].length > 0) {
      svg.selectAll('text')
        .remove()
    }

    svg.append('g')
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('transform', 'translate(100, 100)')
      .style('text-anchor', 'middle')
      .style('color', '#333')
      .style('font-size', '14pt')
      .style('font-weight', 'bold')
      .style('stroke', '#ddd')
      .text(data['都道府県'])
  }


  return (

    <>
      <div id="map"></div>
    </>
  )
}
