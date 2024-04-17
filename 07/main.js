import './style.css'
import * as d3 from "d3";
import Encoding from "encoding-japanese";

async function main() {
  // const data = await d3.csv('/data/lower_state.csv', {
  const data = await d3.csv('/data/upper_vote_AK.csv', {
    headers: {
      // 'content-type': 'text/csv;charset=shift_jis',
      'content-type': 'text/csv;charset=utf-8',
    }
  }, d => {
    console.log(d);
    for (const key in d) {
      console.log(d[key]);
      const encoding = Encoding.detect(d[key])
      console.log(encoding);
      // const str = Encoding.convert(d[key], 'SJIS')
      const str = Encoding.convert(d[key], {
        to: 'SJIS',
        from: encoding,
        type: 'string',
        bom: true
      })
      console.log(str);
    }
  })
  // console.log(data);

  // const dataCSV = await d3.request('/data/lower_state.csv')
  // .header("Content-Type", "text/csv;charset=Shift_JIS")
  // // .mimeType("text/csv")
  // // .send("get")

  // console.log(await dataCSV);


  // const fetchData = await fetch('/data/lower_state.csv', {
  //   method: 'get',
  //   headers: {
  //     // 'content-type': 'text/csv;charset=UTF-8',
  //     'content-type': 'text/csv;charset=Shift_JIS',
  //   }
  // })



  // console.log(await fetchData.text());

  // data.forEach(item => {

  //   for (const key in item) {
  //     document.querySelector('#app').insertAdjacentHTML('beforebegin', `<p>${item[key]}</p>`)

  //     const bin = new Uint8Array(key);
  //     console.log(bin)


  //   }

  //   document.querySelector('#app').insertAdjacentHTML('beforebegin', `<br/>`)
  // })


}


main();