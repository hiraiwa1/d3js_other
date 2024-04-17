import './style.css'
import * as d3 from "d3";
import * as topojson from 'topojson-client';
import Encoding from 'encoding-japanese';

const prefId = {
  '01': '北海道',
  '02': '青森県',
  '03': '岩手県',
  '04': '宮城県',
  '05': '秋田県',
  '06': '山形県',
  '07': '福島県',
  '08': '茨城県',
  '09': '栃木県',
  '10': '群馬県',
  '11': '埼玉県',
  '12': '千葉県',
  '13': '東京都',
  '14': '神奈川県',
  '15': '新潟県',
  '16': '富山県',
  '17': '石川県',
  '18': '福井県',
  '19': '山梨県',
  '20': '長野県',
  '21': '岐阜県',
  '22': '静岡県',
  '23': '愛知県',
  '24': '三重県',
  '25': '滋賀県',
  '26': '京都府',
  '27': '大阪府',
  '28': '兵庫県',
  '29': '奈良県',
  '30': '和歌山県',
  '31': '鳥取県',
  '32': '島根県',
  '33': '岡山県',
  '34': '広島県',
  '35': '山口県',
  '36': '徳島県',
  '37': '香川県',
  '38': '愛媛県',
  '39': '高知県',
  '40': '福岡県',
  '41': '佐賀県',
  '42': '長崎県',
  '43': '熊本県',
  '44': '大分県',
  '45': '宮崎県',
  '46': '鹿児島県',
  '47': '沖縄県'
}


class Map {
  constructor() {
    this.width = 640;
    this.height = 640;
    this.japan = null;

    this.data = null;
    this.fetchData();

    this.app = d3.select('#app');
    this.svg = this.app.append('svg')
                        .attr('viewBox', [0, 0, this.width, this.height])

    this.map = null;
    this.textBox = null;
    this.text = null;

    this.createMap();
    this.windowResize();
  }

  async fetchData() {
    const data = await d3.csv('flu.csv');
    // "2023/11/22"
    const timeParser = d3.timeParse('%Y/%m/%d')

    this.data = await data.map(item => {
      return {
        pref: item['都道府県'],
        date: timeParser(item['日付']),
        watch: item['注意報数'],
        warning: item['警報数'],
        center: item['保健所数']
      }
    })

    console.log(this.data);
  }

  async createMap() {

    this.japan = await d3.json('https://unpkg.com/jpn-atlas@1/japan/japan.json')
    console.log(this.japan);

    const path = d3.geoPath();

    this.map = this.svg.append('g')
            .attr('transform', ' translate(-22, -4)')
            .selectAll('path')
            .data(topojson.feature(this.japan, this.japan.objects.prefectures).features)
            .join('path')
            .attr('stroke', 'gray')
            .attr('stroke-width', 1)
            .attr('fill', data => {
              const prefData = this.data.find(d => d.pref === prefId[data.id])
              return this.color(prefData)
            })
            .attr('d', path)
            .on('click', this.moveMouse.bind(this))

  }

  warningColor(d) {
    const scale = d3.scaleLinear()
              .domain([d3.min(this.data.map(d => d.warning)), d3.max(this.data.map(d => d.warning))])
              .range(['#ffb6c6', '#ff0001'])

    return scale(d);
  }

  watchColor(d) {
    const scale = d3.scaleLinear()
              .domain([d3.min(this.data.map(d => d.watch)), d3.max(this.data.map(d => d.watch))])
              .range(['#ffff04', '#ff8e00'])

    return scale(d);
  }

  color(data) {

    if(data.watch > data.warning) {

      return this.watchColor(data.watch)
    } else if(data.warning > 0) {

      return this.warningColor(data.warning)
    }

    return '#eee';
  }

  moveMouse(_, clickData) {
    const prefData = this.data.find(d => d.pref === prefId[clickData.id])

    this.textBox = this.svg.selectAll('rect')
                        .data([,])
                        .join('rect')
                        .attr('fill', 'none')
                        .attr('stroke', '#333')
                        .attr('stroke-width', 1.5)
                        .attr('x', 2)
                        .attr('y', 2)

    this.text = this.svg.selectAll('text')
            .data([prefData])
            .join('text')
            .attr('class', 'svg-text')
            .attr('fill', '#333')
            .html(d => {
              return `
              <tspan x='0' y='0'>${d.pref}</tspan>
              <tspan x='0' y='1.4em'>保健所数：${d.center}</tspan>
              <tspan x='0' y='2.8em'>注意報数：${d.watch}</tspan>
              <tspan x='0' y='4.4em'>警報数：${d.warning}</tspan>
              `
            })
            .style('text-anchor', 'start')

    this.textBoxSize();
  }

  textBoxSize() {
    if(!this.text && !this.textBox) return;

    this.textBox.attr('width', this.text.node().getBBox().width + 20)
     .attr('height', this.text.node().getBBox().height + 20)
  }

  windowResize() {
    window.addEventListener('resize', () => this.textBoxSize());
  }
}


new Map();