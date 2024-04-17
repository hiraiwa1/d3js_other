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

const svgConf = {
  width: 600,
  height: 600,
  margin: {
    top: 10,
    right: 10,
    bottom: 40,
    left: 40
  }
}


function main() {
  const app = d3.select('#app');

  const bord = app.append('ul')
                  .attr('class', 'borad')

  const dialog = app.append('dialog')
                    .attr('class', 'dialog')

  let svg = createSvg(dialog);


  const bordCard = bord.selectAll('li')
      .data(dataset)
      .enter()
      .append('li')
      .call(d => {

        d.append('p')
          .text(text => text.name)

        d.append('a')
        .on('click', moduleMove);

       });

  function moduleMove(event, data) {
    console.log(data);

    dialog.append('div')
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

    const changeSvg = changeSvgCreate(svg, data);

    modal.open(data);

    modal.close(dialog)
  }

}

const modal = {
  open: (data) => {
    console.log(data);
    document.querySelector('.dialog').showModal()
  },
  close: () => document.querySelector('.dialogClose').addEventListener('click', () => {

    document.querySelector('.dialog').close();
    document.querySelector('.modalInner').remove();
    document.querySelector('.graph').remove();

  })
}

const createSvg = (dialog) => {
  return dialog.append('svg')
                .attr('viewBox', [0, 0, svgConf.width, svgConf.height])
                .attr('preserveAspectRatio', 'xMaxYMid meet')
                .style('border', '1px solid #333')
}

function changeSvgCreate(svg, data) {
  const graph = svg.append('g')
                  .attr('class', 'graph')


  const x = d3.scaleBand()
              .domain(dataset.map(d => d.name))
              .range([svgConf.margin.left, svgConf.width - svgConf.margin.right])
              .padding(0.15)

  const y = d3.scaleLinear()
              .domain([0, d3.max(dataset.map(d => d.data.value))])
              .range([svgConf.height - svgConf.margin.bottom, svgConf.margin.top])

  const xScale = graph.append('g')
                    .attr('transform', `translate(0, ${svgConf.height - svgConf.margin.bottom})`)
                    .call(d3.axisBottom(x))

  const yScale = graph.append('g')
                    .attr('transform', `translate(${svgConf.margin.left}, 0)`)
                    .call(d3.axisLeft(y))



  const newSvg = graph.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', d => x(d.name))
        .attr('y', svgConf.height - svgConf.margin.bottom)
        .attr('width', x.bandwidth())
        .attr('height', 0)
        .attr('fill', d => d.name === data.name ? data.data.color : 'steelblue')
        .transition()
        .duration(1000)
        .delay((d, idx) => idx * 100)
        .attr('height', d => y(d.data.value))
        .attr('y', d => svgConf.height - svgConf.margin.bottom - y(d.data.value))

  return newSvg;
}


main();
