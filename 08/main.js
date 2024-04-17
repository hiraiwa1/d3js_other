import './style.css'
import * as d3 from "d3";

const dataset = [
  {
    'name': 'namaA',
    'title': 'titleName A',
    'text': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam deserunt aut aperiam ex sint quia perferendis, est porro quos minus fugiat ea consectetur at quo molestias ut. Provident, eius aperiam.',
    'data': {
      value: 5,
      color: '#dc3912'
    }
  },
  {
    'name': 'namaB',
    'title': 'titleName B',
    'text': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam deserunt aut aperiam ex sint quia perferendis, est porro quos minus fugiat ea consectetur at quo molestias ut. Provident, eius aperiam.',
    'data': {
      value: 6,
      color: '#3366cc'
    }
  },
  {
    'name': 'namaC',
    'title': 'titleName C',
    'text': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam deserunt aut aperiam ex sint quia perferendis, est porro quos minus fugiat ea consectetur at quo molestias ut. Provident, eius aperiam.',
    'data': {
      value: 8,
      color: '#109618'
    }
  },
  {
    'name': 'namaD',
    'title': 'titleName D',
    'text': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam deserunt aut aperiam ex sint quia perferendis, est porro quos minus fugiat ea consectetur at quo molestias ut. Provident, eius aperiam.',
    'data': {
      value: 1,
      color: '#ff9900'
    }
  },
  {
    'name': 'namaE',
    'title': 'titleName E',
    'text': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam deserunt aut aperiam ex sint quia perferendis, est porro quos minus fugiat ea consectetur at quo molestias ut. Provident, eius aperiam.',
    'data': {
      value: 2,
      color: '#990099'
    }
  },
  {
    'name': 'namaF',
    'title': 'titleName F',
    'text': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam deserunt aut aperiam ex sint quia perferendis, est porro quos minus fugiat ea consectetur at quo molestias ut. Provident, eius aperiam.',
    'data': {
      value: 8,
      color: '#dc3912'
    }
  },
  {
    'name': 'namaG',
    'title': 'titleName G',
    'text': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam deserunt aut aperiam ex sint quia perferendis, est porro quos minus fugiat ea consectetur at quo molestias ut. Provident, eius aperiam.',
    'data': {
      value: 6,
      color: '#3366cc'
    }
  },
  {
    'name': 'namaH',
    'title': 'titleName H',
    'text': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam deserunt aut aperiam ex sint quia perferendis, est porro quos minus fugiat ea consectetur at quo molestias ut. Provident, eius aperiam.',
    'data': {
      value: 10,
      color: '#109618'
    }
  },
  {
    'name': 'namaI',
    'title': 'titleName I',
    'text': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam deserunt aut aperiam ex sint quia perferendis, est porro quos minus fugiat ea consectetur at quo molestias ut. Provident, eius aperiam.',
    'data': {
      value: 9,
      color: '#ff9900'
    }
  }
];

class Main {
  constructor() {
    this.svgConf = {
      width: 600,
      height: 600,
      margin: {
        top: 10,
        right: 10,
        bottom: 40,
        left: 40
      }
    }

    this.app = d3.select('#app');

    this.bord = this.app.append('ul')
                  .attr('class', 'borad')

    this.dialog = this.app.append('dialog')
                    .attr('class', 'dialog')
    console.log(this.dialog);

    this.svg = this.createSvg(this.dialog);

    this.bordCard();
  }

  modal = {
    open: () => {
      document.querySelector('.dialog').showModal()
    },
    close: () => document.querySelector('.dialogClose').addEventListener('click', () => {

      document.querySelector('.dialog').close();
      document.querySelector('.modalInner').remove();
      document.querySelector('.graph').remove();

    })
  }

  bordCard() {
    return this.bord.selectAll('li')
    .data(dataset)
    .enter()
    .append('li')
    .call(d => {

      d.append('p')
        .text(text => text.name)

      d.append('a')
      .on('click', this.moduleMove.bind(this));

     });

  }

  moduleMove(event, data) {

    this.dialog.append('div')
          .attr('class', 'modalInner')
          .call(inner => {

            inner.append('h3')
                  .text(data.title)

            inner.append('p')
                  .text(data.text)

            inner.append('button')
                  .attr('class', 'dialogClose')
                  .text('close')
          })

    const changeSvg = this.changeSvgCreate(this.svg, data);

    this.modal.open();

    this.modal.close(this.dialog)
  }

  changeSvgCreate(svg, data) {
    const graph = svg.append('g')
                    .attr('class', 'graph')


    const x = d3.scaleBand()
                .domain(dataset.map(d => d.name))
                .range([this.svgConf.margin.left, this.svgConf.width - this.svgConf.margin.right])
                .padding(0.15)

    const y = d3.scaleLinear()
                .domain([0, d3.max(dataset.map(d => d.data.value))])
                .range([this.svgConf.height - this.svgConf.margin.bottom, this.svgConf.margin.top])

    const xScale = graph.append('g')
                      .attr('transform', `translate(0, ${this.svgConf.height - this.svgConf.margin.bottom})`)
                      .call(d3.axisBottom(x))

    const yScale = graph.append('g')
                      .attr('transform', `translate(${this.svgConf.margin.left}, 0)`)
                      .call(d3.axisLeft(y))

    const graphGroup = graph.append('g')

    const newSvg = graphGroup.selectAll('rect')
          .data(dataset)
          .enter()
          .append('rect')
          .attr('x', d => x(d.name))
          .attr('y', this.svgConf.height - this.svgConf.margin.bottom)
          .attr('width', x.bandwidth())
          .attr('height', 0)
          .attr('fill', d => d.name === data.name ? data.data.color : 'steelblue')
          .transition()
          .duration(1000)
          .delay((d, idx) => idx * 100)
          .attr('height', d => this.svgConf.height - y(d.data.value) - this.svgConf.margin.bottom)
          .attr('y', d => y(d.data.value))

    graphGroup.selectAll('text')
              .data(dataset)
              .enter()
              .append('text')
              .attr('x', d => x(d.name) + (x.bandwidth() / 2))
              .attr('y', d => y(d.data.value))
              .style('opacity', 0)
              .style('text-anchor', 'middle')
              .style('transform', d => d.data.value < 9 ? 'translate(0, -10pt)' : 'translate(0, 20pt)')
              .style('fill', d => d.data.value < 9 ? '#333' : '#fff')
              .text(d => d.data.value)
              .transition()
              .duration(1000)
              .delay((d, idx) => (idx + 1) * 110)
              .style('opacity', 1)

    return newSvg;
  }



  createSvg(dialog) {
    return dialog.append('svg')
                  .attr('viewBox', [0, 0, this.svgConf.width, this.svgConf.height])
                  .attr('preserveAspectRatio', 'xMaxYMid meet')
                  .style('border', '1px solid #333')
  }


}


new Main();