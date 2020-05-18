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
      for (let i = 0; i < data.length; i++) {
        if (data[i].City.includes(event.message.text)) {
          // msg.push({ type: 'text', text: data[i].Name })
          msg.push(
            { type: 'text', text: data[i].Name },
            {
              type: 'image',
              originalContentUrl: data[i].Photo,
              previewImageUrl: data[i].Photo
            })
          // '\n' + data[i].Address
          // msg.push({
          //   type: 'location',
          //   title: data[i].Name,
          //   address: data[i].Address
          // })
        }
      }
    }
  } catch (error) {
    msg = '發生錯誤'
  }
  console.log(msg)
  event.reply(msg)
})
// 在 port 啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
