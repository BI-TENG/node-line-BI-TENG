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

// 當收到訊息時
// bot.on('message', function (event) {
//   if (event.message.type === 'text') {
//     event.source.profile().then(function (profile) {
//       event.reply(profile.displayName + '你再說一次試試看')
//     })
//   }
// })

// 當收到訊息時
// bot.on('message', event => {
//   if (event.message.type === 'text') {
//     event.reply(event.message.text)
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
              new: i.OpenHours,
              actions: [{
                type: 'postback',
                label: '地理位置',
                data: i.Coordinate + ',' + i.Address + ',' + i.OpenHours
              }, {
                type: 'postback',
                label: '營業時間、聯絡資訊',
                data: i.Name + '\n' + i.OpenHours + '\n' + i.Tel
              }, {
                type: 'postback',
                label: '可否用信用卡、國旅卡',
                data: i.Name + '\n' + i.CreditCard + '\n' + i.TravelCard
              }]
            })
        } else if (i.HostWords.includes(event.message.text)) {
          msg.push(
            {
              thumbnailImageUrl: i.Photo,
              title: i.Name,
              text: i.Address,
              text1: i.OpenHours,
              actions: [{
                type: 'postback',
                label: '地理位置',
                data: i.Coordinate + ',' + i.Address
              }, {
                type: 'postback',
                label: '營業時間、聯絡資訊',
                data: i.Name + '\n' + i.OpenHours + '\n' + i.Tel
              }, {
                type: 'postback',
                label: '可否用信用卡、國旅卡',
                data: i.Name + '\n' + i.CreditCard + '\n' + i.TravelCard
              }]
            })
        } else if (i.Address.includes(event.message.text)) {
          msg.push(
            {
              thumbnailImageUrl: i.Photo,
              title: i.Name,
              text: i.Address,
              text1: i.OpenHours,
              actions: [{
                type: 'postback',
                label: '地理位置',
                data: i.Coordinate + ',' + i.Address
              }, {
                type: 'postback',
                label: '營業時間、聯絡資訊',
                data: i.Name + '\n' + i.OpenHours + '\n' + i.Tel
              }, {
                type: 'postback',
                label: '可否用信用卡、國旅卡',
                data: i.Name + '\n' + i.CreditCard + '\n' + i.TravelCard
              }]
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

bot.on('postback', event => {
  console.log(event.postback.data.split(','))
  event.reply({
    type: 'location',
    title: '所在位置',
    address: event.postback.data.split(',')[2],
    latitude: event.postback.data.split(',')[0],
    longitude: event.postback.data.split(',')[1]
  })
})

bot.on('postback', event => {
  event.reply({
    type: 'text',
    text: event.postback.data
  })
})

bot.on('postback', event => {
  event.reply({
    type: 'text',
    text: event.postback.data
  })
})
// 在 port 啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
