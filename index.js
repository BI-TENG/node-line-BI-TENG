// 引用 linebot 套件
import linebot from 'linebot'
// 引用 dotenv 套件
import dotenv from 'dotenv'

import rp from 'request-promise'

// 讀取 env 檔
dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// // 當收到訊息時
// bot.on('message', function (event) {
//   if (event.message.type === 'text') {
//     event.source.profile().then(function (profile) {
//       event.reply(profile.displayName + '你再說一次試試看')
//     })
//   }
// })

bot.on('message', async (event) => {
  let msg = []
  try {
    const data = await rp({ uri: 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelStay.aspx', json: true })
    if (event.message.type === 'text') {
      for (const i of data) {
        if (i.City.includes(event.message.text)) {
          msg.push(
            {
              thumbnailImageUrl: i.Photo,
              title: i.Name,
              text: i.Address,
              latitude: 35.65910807942215,
              longitude: 139.70372892916203,
              actions: [{
                type: 'postback',
                label: 'Buy',
                data: 'action=buy&itemid=222'
              }, {
                type: 'postback',
                label: 'Add to cart',
                data: 'action=add&itemid=222'
              }, {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/111'
              }]
              // msg.push({
              //   type: 'location',
              //   title: data[i].Name,
              //   address: data[i].Address,
              //   latitude: 35.65910807942215,
              //   longitude: 139.70372892916203
              // })
            })
        }
      }
    }
  } catch (error) {
    msg = '發生錯誤'
  }
  console.log(msg[0].actions[2].uri)
  event.reply({
    type: 'template',
    altText: 'this is a carousel template',
    template: {
      type: 'carousel',
      columns: msg
    }
  })
})
// 在 port 啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
