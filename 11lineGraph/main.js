import './style.css'
import * as d3 from "d3";

const getData = async () => {
  const response = await fetch('https://www3.nhk.or.jp/n-data/us-election-data/rcp_avg.json')
  const json = await response.json()
  return json.rcp_avg
}


const initData = await getData()
const data = initData.reverse();

const approve = data.map(d => ({ date: d.date, value: d.candidate[0].value}));
const disapprove = data.map(d => ({ date: d.date, value: d.candidate[1].value }));

const width = 900
const height = 600
const margin = {
  top: 10,
  right: 30,
  bottom: 60,
  left: 60
}

// "Thu, 25 Jan 2024 00:00:00 -0600"
const timeparser = d3.timeParse("%a, %d %b %Y %H:%M:%S %Z");
const format = d3.timeFormat("%Y/%m");

const svg = d3.select('#app').append('svg')

svg
  .attr('viewBox', [0, 0, width, height])
  // .attr('width', width)
  // .attr('height', height)

const dateArray = data.map(d => timeparser(d.date));
const xScale = d3.scaleTime()
  .domain([d3.min(dateArray), d3.max(dateArray)])
  .range([margin.left, width - margin.right])

const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => {
    if(Number(d.candidate[0].value) >= Number(d.candidate[1].value)) return d.candidate[0].value
    if(Number(d.candidate[0].value) < Number(d.candidate[1].value)) return d.candidate[1].value
  })])
  .range([height - margin.bottom, margin.top])

const axisX = d3.axisBottom(xScale).tickFormat(format)
const axisY = d3.axisLeft(yScale)


const line = svg.append('g')
  .attr('class', 'vertical-line')

svg.append('g')
  .attr('class', 'axis-x')
  .call(axisX)
  .attr('transform', `translate(0, ${height - margin.bottom})`)

svg.append('g')
  .attr('class', 'axis-y')
  .call(axisY)
  .attr('transform', `translate(${margin.left}, 0)`)


svg.append('g')
  .attr('class', 'line-Approve')
  .append('path')
  .datum(approve)
  .attr('fill', 'none')
  .attr('stroke', 'steelblue')
  .attr('stroke-width', 1.5)
  .attr('d', d3.line()
    .x(d => xScale(timeparser(d.date)))
    .y(d => yScale(d.value)))

svg.append('g')
  .attr('class', 'line-Disapprove')
  .append('path')
  .datum(disapprove)
  .attr('fill', 'none')
  .attr('stroke', 'tomato')
  .attr('stroke-width', 1.5)
  .attr('d', d3.line()
    .x(d => xScale(timeparser(d.date)))
    .y(d => yScale(d.value))
  )



line.append('line')
  .attr('x1', width - margin.right)
  .attr('x2', width - margin.right)
  .attr('y1', margin.top)
  .attr('y2', height - margin.bottom)
  .attr('fill', 'none')
  .attr('stroke', '#333')
  .attr('stroke-width', 2)

const approveCircle = line.append('circle')
    .attr('cx', xScale(timeparser(approve[approve.length - 1].date)))
    .attr('cy', yScale(approve[approve.length - 1].value))
    .attr('r', 10)
    .attr('transform', 'translate(0, 5)')
    .attr('fill', 'steelblue')
    .attr('stroke-width', 0)

const disapproveCircle = line.append('circle')
    .attr('cx', xScale(timeparser(disapprove[disapprove.length - 1].date)))
    .attr('cy', yScale(disapprove[disapprove.length - 1].value))
    .attr('r', 10)
    .attr('transform', 'translate(0, 5)')
    .attr('fill', 'tomato')
    .attr('stroke-width', 0)

// const bisector = d3.bisector(d => timeparser(d.date)).left
const bisector = d3.bisector(d => timeparser(d.date)).left

console.log(svg.select('.axis-x').node().getBoundingClientRect());

const tooltip = d3.select('#app').append('div')
  .attr('class', 'tooltip')
  .style('top', `50%`)
  .style('left', `${svg.select('.axis-x').node().getBoundingClientRect().right}px`)
  .style('transform', `translate(calc(-100% - 20px), -50%)`)

tooltip.append('p')
  .attr('class', 'tooltip-approve')
  .text(approve[approve.length - 1].value)

tooltip.append('p')
  .attr('class', 'tooltip-disapprove')
  .text(disapprove[disapprove.length - 1].value)
console.log(approve);
const halfWidth = (width - margin.left - margin.right) * 0.5 + margin.left
svg.on("mousemove touchmove", (event) => {
  let index = bisector(approve, xScale.invert(d3.pointer(event)[0]))
  index = approve.length <= index ? approve.length - 1 : index;

  line.select(':scope > line').attr('transform', `translate(${xScale(timeparser(approve[index].date)) - (width - margin.right)}, 0)`)

  approveCircle
    .attr('cx', xScale(timeparser(approve[index].date)))
    .attr('cy', yScale(approve[index].value))

  disapproveCircle
    .attr('cx', xScale(timeparser(disapprove[index].date)))
    .attr('cy', yScale(disapprove[index].value))


  tooltip.select('.tooltip-approve')
    .text(approve[index].value)

  tooltip.select('.tooltip-disapprove')
    .text(disapprove[index].value)

  if(xScale(timeparser(approve[index].date)) <= margin.left) {
    const yScalePosX = svg.select('.axis-y > .domain').node().getBoundingClientRect().x

    tooltip.style('left', `${yScalePosX}px`)

  } else if(xScale(timeparser(approve[index].date)) >= width - margin.right) {
    tooltip
      .style('left', `${svg.select('.axis-x').node().getBoundingClientRect().right}px`)

  } else {
    const tooltipX = event.x;

    tooltip
      .style('left', `${tooltipX}px`)
  }

  if(halfWidth > xScale(timeparser(approve[index].date))) {
    tooltip.style('transform', `translate(20px, -50%)`)
  } else {
    tooltip.style('transform', `translate(calc(-100% - 20px), -50%)`)

  }
})
