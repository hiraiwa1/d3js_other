import './style.css'
import * as d3 from 'd3'
import Encoding from "encoding-japanese";



class Main {
  constructor() {
    this.width = 640;
    this.height = 360;
    this.margin = {
      top: 10,
      right: 20,
      bottom: 40,
      left: 40
    }
    this.data = null;
    this.xData = null;
    this.yData = null;

    this.getData();

    this.timeParser = d3.timeParse('%Y/%m')

    this.app = d3.select('#app')
    this.createTitle();

    this.svg = this.app.append('svg')
                        .attr('viewBox', [0, 0, this.width, this.height])
                        .attr('preserveAspectRatio', 'xMidYMid meet')

    this.xScale = null;
    this.yScale = null;

    this.line = null;
    this.tooltip = null;
    this.border = null;

    this.movePointer();
  }

  async getData() {
    let plane = await fetch('data.csv')
    plane = await plane.text()
    plane = await plane.split('\r\n') // \r\n 改行
    plane = plane.filter(item => /(2022|2023)/i.test(item) ? item : null)

    this.data = await plane.map(item => {
      const data = item.split(',')
      return {
        date: this.timeParser(data[0]),
        temp: data[1]
      }
    })

    this.xData = this.data.map(d => d.date)
    this.yData = this.data.map(d => Number(d.temp))

    this.createGraph();
  }

  createTitle() {
    this.app.append('p')
            .attr('class', 'title')
            .text('東京都平均気温（2022年11月〜2023年11月）')
  }

  createScale() {
    const scale = this.svg.append('g')
                          .attr('class', 'scale')

    this.xScale = d3.scaleTime()
                      .domain([d3.min(this.xData), d3.max(this.xData)])
                      .range([this.margin.left, this.width - this.margin.right])

    console.log(d3.max(this.data, d => Number(d.temp)))

    this.yScale = d3.scaleLinear()
                      .domain([0, d3.max(this.yData)])
                      .range([this.height - this.margin.bottom, this.margin.top])

    const xAxis = scale.append('g')
                          .attr('transform', `translate(0, ${this.height - this.margin.bottom})`)
                          .call(d3.axisBottom(this.xScale)
                                  .tickFormat(d3.timeFormat('%Y/%m'))
                          )


    const yAxis = scale.append('g')
                          .attr('transform', `translate(${this.margin.left}, 0)`)
                          .call(d3.axisLeft(this.yScale))
                          .call(g => {
                            g.selectAll('.tick line')
                              .clone()
                              .attr('x2', this.width - this.margin.left - this.margin.right)
                              .attr('stroke-opacity', 0.1)
                          })

  }

  createLine() {
    const linePath = d3.line()
                        .x(d => this.xScale(d.date))
                        .y(d => this.yScale(d.temp))


    const line = this.svg.append('g')

    line.append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 1.5)
      .attr('d', linePath)

    const totalLength = line.selectChild().node().getTotalLength()
    line.attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        // .transition()
        // .duration(1500)
        // .attr('stroke-dashoffset', 0)

    this.line = line;
  }

  scrollObserver() {
    const cb = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");

          this.line
                  .transition()
                  .duration(1500)
                  .attr('stroke-dashoffset', 0)

          observer.unobserve(entry.target);
        }

        console.log(entry);
        console.log(this);
      });
    }

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: [0, 0.25, 1],
    };

    const observer = new IntersectionObserver(cb, options)

    observer.observe(this.app._groups[0][0])
  }

  createBorder() {
    this.border = this.svg.append('g')
                          .attr('class', 'border')
                          .append('rect')
                          .attr('width', 2)
                          .attr('height', (this.height - this.margin.top - this.margin.bottom))
                          .attr('x', this.margin.left - 1)
                          .attr('y', this.margin.top)
                          .style('fill', 'rgba(255, 165, 0, 0.5)')

  }

  createTooltip() {
    const tooltip = this.svg.append('g')
                        .attr('class', 'tooltip')
                        .style('ponter-events', 'none')

    this.tooltip = tooltip;
  }


  async createGraph() {
    this.createBorder();
    this.createScale();

    this.createLine();
    this.createTooltip();
    this.scrollObserver();

  }

  async moveTooltip(event) {

    const idx = d3.bisectCenter(this.xData, this.xScale.invert(d3.pointer(event)[0]))

    this.tooltip.style('display', null)
                .attr('transform', `translate(${this.xScale(this.xData[idx])}, ${this.yScale(this.yData[idx])})`)

    const tooltipPath = this.tooltip.selectAll('path')
                              .data([,])
                              .join('path')
                              .attr('fill', "#fff")
                              .attr('stroke', '#333')

    const tooltipText = this.tooltip.selectAll('text')
                              .data([,])
                              .join('text')
                              .call(text => text.selectAll('tspan')
                                                .data([(d3.timeFormat('%Y/%m'))(this.xData[idx]), `${this.yData[idx]}℃`])
                                                .join('tspan')
                                                .attr('x', 0)
                                                .attr('y', (_, idx) => `${idx * 1.4}em`)
                                                .text(d => d)
                              )

    const { height, width, x, y } = tooltipText.node().getBBox();

    if(idx === this.xData.length - 1) {
      tooltipPath.attr('d', `M0,5 H0 l0,-5 l-5,5 H${-width - 20}v${height + 20}h${width + 20}z`)
      tooltipText.attr('transform', `translate(-${width + 10}, ${15 - y})`)
    } else if(idx === 0) {
      tooltipPath.attr('d', `M0,5 H0 l0,-5 l5,5 H${width + 20}v${height + 20}h-${width + 20}z`)
      tooltipText.attr('transform', `translate(10, ${15 - y})`)
    } else {
      if(this.yData[idx] > 7) {
        tooltipPath.attr('d', `M${-width / 2 - 10},5 H-5 l5,-5 l5,5 H${width / 2 + 10}v${height + 20}h-${width + 20}z`)
        tooltipText.attr('transform', `translate(-${width / 2}, ${15 - y})`)
      } else {
        tooltipPath.attr('d', `M${-width / 2 - 10},-5 H-5 l5,5 l5,-5 H${width / 2 + 10}v-${height + 20}h-${width + 20}z`)
        tooltipText.attr('transform', `translate(-${width / 2}, ${-25 + y})`)

      }
    }

    this.moveBorder(event);

  }

  moveBorder(event) {
    const points = d3.pointer(event)[0]
    this.border.attr('transform', `translate(${points - this.margin.left}, 0)`)

    if(points < this.margin.left || points >= this.width - this.margin.right) {
      this.border.style('display', 'none')
    } else {
      this.border.style('display', null)
    }
  }

  removeTooltip() {
    this.tooltip.style('display', 'none')
  }

  movePointer() {
    this.svg.on('pointerenter pointermove', this.moveTooltip.bind(this))
    this.svg.on('pointerleave', this.removeTooltip.bind(this))
  }
}

new Main();