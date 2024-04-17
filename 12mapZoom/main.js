import './style.css'
import * as d3 from 'd3';
import * as topojson from 'topojson-client';


const width = 750;
const height = 400;
const rangeMin = 1;
const rangeMax = 3;
const zoom = d3.zoom()
  .scaleExtent([rangeMin, rangeMax]) // スケールの範囲 [最小スケール係数, 最大スケール係数] スケール範囲の対応する限界に達しているとき、ホイール イベントは無視され、ズーム ジェスチャは開始されない
  .on('zoom', zoomed) // zoom.on(typenames, listener) リスナーが指定されている場合、指定された型名のイベントリスナーを設定し、ズーム動作を返す
/* typenames
start- ズーム開始後 (マウスダウン時など)。
zoom- ズーム変換の変更後 (マウス移動時など)。
end- ズーム終了後 (マウスアップ時など)。
 */

/** 地図データ */
// const us = await d3.json('/states-albers-10m.json')
// console.log(us);
// console.log(topojson.feature(us, us.objects.states).features);

const svg = d3.select('#app').select('svg')
const g = svg.select('g')


const range = document.querySelector('.range')


svg.call(zoom)

function reset() {
  // states.transition().style('fill', null)
  svg.transition().duration(750).call(
    zoom.transform,
    d3.zoomIdentity,
    d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
  )
}
let count = 0;

function zoomed(event) {
  // console.log(event);
  const { transform } = event;
  if(transform.k === 1 && count === 0) {
    console.log('hi');
    reset();
    count = 1;
    return;
  }
  if(transform.k !== 1) {
    g.attr('transform', transform)
    g.attr('stroke-width', 1 / transform.k)
    count = 0;
  }
  console.log(event);
  console.log(transform.k);
  console.log(range.value);

  checkValue(transform.k);

  return;
}


svg.on('mouseover', () => {
  console.log('move');
  console.log(d3.zoomTransform(svg.node()));
  const zoomTransform = d3.zoomTransform(svg.node())

  // zoomが１の場合は、center位置に戻す
  if(zoomTransform.k === 1) reset();
})

// range.value = '0'
range.addEventListener('change', (e) => {
  console.log(e.target.value)
  const value = e.target.value
  const diffrange = (rangeMax - rangeMin)
  const zoomrange = diffrange / 100
  const toRange = (zoomrange * value) + rangeMin

  zoom.scaleTo(svg.transition().duration(750), toRange)

})

const outButton = document.querySelector('.zoom-out')
outButton.addEventListener('click', (e) => {
  e.preventDefault();

  changeZoom('out')
})

const inButton = document.querySelector('.zoom-in')
inButton.addEventListener('click', (e) => {
  e.preventDefault();

  changeZoom('in')
})

const rangeValue = () => {
  const diffrange = (rangeMax - rangeMin)
  return diffrange / 10;
}

function changeZoom(inOutValue) {
  const plusNum = inOutValue === 'in' ? 1 : -1;
  const zoomRange = rangeValue();

  let value = range.value;

  const valuerange =  (value / 100) * 10 + plusNum;
  const toRange = (zoomRange * valuerange) + rangeMin
  range.value = valuerange * 10;

  zoom.scaleTo(svg.transition().duration(750), toRange)

}

let moveTimer = 0;
function checkValue(chengeValue) {

  const zoomRange = rangeValue();
  const value = range.value / 10;

  const checkV = rangeMin + (zoomRange * value);

  clearTimeout(moveTimer);
  moveTimer = setTimeout(() => {

    if(chengeValue !== checkV) {
      console.log('check');
      range.value = ((chengeValue - rangeMin) / zoomRange) * 10;
    }
  }, 100);

}