import './style.css'
import * as d3 from "d3";
import * as topojson from "topojson-client";


const rawData = `日付,都道府県,保健所数,注意報数,警報数
2020/2/12,北海道,30,10,5
2020/2/12,青森県,8,0,0
2020/2/12,岩手県,10,6,0
2020/2/12,宮城県,13,1,1
2020/2/12,秋田県,9,0,2
2020/2/12,山形県,5,0,1
2020/2/12,福島県,9,1,3
2020/2/12,茨城県,9,0,0
2020/2/12,栃木県,6,0,0
2020/2/12,群馬県,12,6,2
2020/2/12,埼玉県,17,5,3
2020/2/12,千葉県,16,4,3
2020/2/12,東京都,31,3,0
2020/2/12,神奈川県,37,6,1
2020/2/12,新潟県,13,3,3
2020/2/12,富山県,5,1,0
2020/2/12,石川県,5,2,0
2020/2/12,福井県,7,0,2
2020/2/12,山梨県,6,1,1
2020/2/12,長野県,11,1,4
2020/2/12,岐阜県,8,0,0
2020/2/12,静岡県,9,2,2
2020/2/12,愛知県,31,4,11
2020/2/12,三重県,9,3,1
2020/2/12,滋賀県,7,2,2
2020/2/12,京都府,19,7,1
2020/2/12,大阪府,42,13,8
2020/2/12,兵庫県,17,6,3
2020/2/12,奈良県,5,1,0
2020/2/12,和歌山県,9,1,1
2020/2/12,鳥取県,3,0,1
2020/2/12,島根県,8,1,0
2020/2/12,岡山県,7,3,2
2020/2/12,広島県,14,4,1
2020/2/12,山口県,8,0,2
2020/2/12,徳島県,6,0,0
2020/2/12,香川県,5,0,0
2020/2/12,愛媛県,7,3,1
2020/2/12,高知県,6,0,3
2020/2/12,福岡県,19,1,5
2020/2/12,佐賀県,5,1,1
2020/2/12,長崎県,10,2,5
2020/2/12,熊本県,11,0,2
2020/2/12,大分県,7,0,1
2020/2/12,宮崎県,9,0,4
2020/2/12,鹿児島県,14,3,3
2020/2/12,沖縄県,6,2,2`;


const data = d3.csvParse(rawData, d3.autoType).map((data, index) => ({
  warningRate: data['警報数'] / data['保健所数'],
  watchRate: data['注意報数'] / data['保健所数'],
  id: d3.format("02")(index + 1),
  ...data
}))


const warningColor = d3.scaleLinear()
  .domain([0, 1])
  .range(["hsl(0, 100%, 90%)", "hsl(0, 100%, 40%)"])

const watchColor = d3.scaleLinear()
  .domain([0, 1])
  .range(["hsl(30, 100%, 90%)", "hsl(30, 100%, 50%)"])

const color = (id) => {
  const d = data.find(d => d.id === id);
  // console.log(d);

  if(d.warningRate > 0) return warningColor(d.warningRate)
  else if(d.watchRate > 0) return watchColor(d.watchRate)

  return '#eee'
}


async function app() {
  const japan = await d3.json('https://unpkg.com/jpn-atlas@1/japan/japan.json')

  // console.log(data);


  const svg = d3.select('#chart')
                  .append('svg')
                  .attr('viewBox', [0, 0, 850, 680])
                  .attr('width', 850)
                  .attr('height', 680)


  const path = d3.geoPath()

  // paht作成
  svg.selectAll('path')
    .data(topojson.feature(japan, japan.objects.prefectures).features)
    .join('path')
    .attr('stroke-width', 0.5)
    // .attr('fill', data => "#eee")
    .attr('fill', data => color(data.id))
    .attr('d', path)
    .on('click', clicked)


}

function clicked(event, clickData) {
  console.log(event);
  console.log(clickData);
  const futureData = data.find(d => d.id === clickData.id)
  console.log(futureData);
}


app();