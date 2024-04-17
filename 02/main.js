import './style.css'
import * as d3 from 'd3'


async function main() {
  const data = await fetch('2.json').then(res => res.json())
  console.log(data);
  const width = 600;
  const height = 600;

  const svg = d3
      .select('#app')
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('preserveAspectRatio', 'xMidYMid meet')

  let dataset = [
    {
      date: "2023/1/1",
      value: 70
    },
    {
      date: "2023/2/1",
      value: 65.5
    },
    {
      date: "2023/3/1",
      value: 81.6
    },
    {
      date: "2023/4/1",
      value: 55.3
    },
    {
      date: "2023/5/1",
      value: 30.6
    },
    {
      date: "2023/6/1",
      value: 55.4
    },
    {
      date: "2023/7/1",
      value: 72.9
    },
    {
      date: "2023/8/1",
      value: 82.2
    },
    {
      date: "2023/9/1",
      value: 66.4
    },
    {
      date: "2023/10/1",
      value: 73.3
    },
    {
      date: "2023/11/1",
      value: 25.4
    },
    {
      date: "2023/12/1",
      value: 57.4
    }
  ]

  let timeparser = d3.timeParse("%Y/%m/%d");
  let format = d3.timeFormat("%Y/%m");
  const color = "skyblue"

  class LineChart {
    constructor() {
      this.padding = 24;

      this.width = null;
      this.height = null;

      this.x = null;
      this.y = null;
      this.path = null;
      this.tooltiop = null;

      this.xScale = null;
      this.yScale = null;
    }

    initialize() {
      dataset = dataset.map((d) => {return { date: timeparser(d.date), value: d.value }})

      this.rendar()
      this.update()
      this.animate();
      this.pointermoved()

      this.resize()
    }

    rendar() {
      this.x = svg.append("g")
        .attr("class", "axis axis-x")

      this.y = svg.append("g")
        .attr("class", "axis axis-y")

      this.path = svg.append("path");
      this.tooltiop = d3.select('#app')
        .append("div")
        .attr("class", "chart--tooptip")
        .style('position', 'absolute')
    }

    update() {

      this.width = svg.node().viewBox.baseVal.width - this.padding;
      this.height = svg.node().viewBox.baseVal.height - this.padding;

      this.addScales();

      this.addLine();
    }

    resize() {

      let _this = this;
      window.addEventListener('resize', () => _this.update())
    }

    addScales() {

      let xTicks = (window.innerWidth < 768) ? 6 : 12;

      /* x軸のメモリ */
      this.xScale = d3.scaleTime()
        .domain([
          d3.min(dataset, (d) => d.date),
          d3.max(dataset, (d) => d.date)
        ])
        .range([this.padding, this.width])

      /* y軸のメモリ */
      this.yScale = d3.scaleLinear()
        .domain([
          0,
          d3.max(dataset, (d) => d.value)
        ])
        .range([this.height, this.padding])

      const axisx = d3.axisBottom(this.xScale)
        .ticks(xTicks)
        .tickFormat(format)

      const axisy = d3.axisLeft(this.yScale)

      console.log(this.x, this.y);
      this.x.attr("transform", `translate(${0}, ${this.height})`)
        .call(axisx)

      this.y.attr("transform", `translate(${this.padding}, 0)`)
        .call(axisy)

    }

    addLine() {
      const line = d3.line()
        .x((d) => this.xScale(d.date))
        .y((d) => this.yScale(d.value))
        .curve(d3.curveCatmullRom.alpha(0.4)) // 線を曲線にする

      this.path.datum(dataset)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("d", line)
    }

    animate() {
      let totalLength = this.path.node().getTotalLength();

      this.path.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .ease(d3.easeCircleInOut)
        .attr("stroke-dashoffset", 0)

    }

    pointermoved() {

      // this.path.on("mousemove touchmove", (event) => {
      //   console.log(this.xScale.invert(d3.pointer(event, this)[0]));
      // //   console.log({x, y}, idx);
      // //   this.tooltiop.style('left', `${x}px`)
      // //     .style('top', `${y}px`)
      // //     .style('visibility', 'visible')
      //   const i = d3.utcDay.round(dataset, this.xScale.invert(d3.pointer(event, this)[0]))
      // console.log(dataset(i));

      // })
      svg.on("mousemove touchmove", (event) => {
        console.log(this.xScale.invert(d3.pointer(event, this)[0]));
      //   console.log({x, y}, idx);
      //   this.tooltiop.style('left', `${x}px`)
      //     .style('top', `${y}px`)
      //     .style('visibility', 'visible')
        // const i = d3.utcDay.round(dataset, this.xScale.invert(d3.pointer(event, this)[0]))
        const i = d3.bisector(dataset, this.xScale.invert(d3.pointer(event, this)[0]))
      console.log(i);

      })
    }
  }

  const lineChart = new LineChart();
  lineChart.initialize();





}

main()