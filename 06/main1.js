import './style.css'
import * as d3 from 'd3';

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
];

const width = 600;
const height = 400;
const padding = 30;

const svg = d3.select('#app')
              .append('svg')
              .attr('width', width)
              .attr('height', height)

const xScale = d3.scaleBand()
                  .rangeRound([padding, width - padding]) // [30, 600 - 30] 左端, 幅引く左端
                  .padding(0.15) // 棒と棒の間のpadding
                  .domain(dataset.map(d => d.name)) // データの配列

const yScale = d3.scaleLinear()
                  .domain([0, d3.max(dataset, d => d.value)]) // [0, max]データ0からデータのマックス値までの幅
                  .range([height - padding, padding]) // 表示エリアの縦max値から下の最小値

/* x軸 */
svg.append('g')
    .attr('transform', `translate(0, ${height - padding})`)
    .call(d3.axisBottom(xScale))

/* y軸 */
svg.append('g')
    .attr('transform', `translate(${padding}, 0)`)
    .call(d3.axisLeft(yScale))

const rects = svg.append('g')
  .selectAll('rect')
  .data(dataset)
  .enter()
  .append('rect')
  .attr('x', d => xScale(d.name))
  .attr('y', height - padding) // y軸の位置をx軸のスケールの上にする
  .attr('width', xScale.bandwidth())
  .attr("height", 0) // 高さは０
  // .attr("height", d => height - padding - yScale(d.value))
  .attr('fill', 'steelblue')


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
    rects.transition()
        .duration(1000)
        // .ease(d3.easeElastic.period(0.10))
        .ease(d3.easeElasticInOut)
        .delay((d, idx) => idx * 100) // アニメーションの開始をindexに１００ms掛け合わした時間
        .attr("height", d => yScale(d.value)) // 高さを上げる
        .attr('y', d => height - padding - yScale(d.value)) // 高さが上がるのと合わせてy軸の位置も上げる

    observer.unobserve(entry.target);
  });
}
