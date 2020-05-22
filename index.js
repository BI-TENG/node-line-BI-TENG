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

bot.on('message', async (event) => {
  let msg = []

  try {
    const data = await rp({ uri: 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelStay.aspx', json: true })
    // const data2 = await rp({ uri: 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvMovingRoad.aspx', json: true })
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
              data: i.Name + ',' + i.OpenHours + ',' + i.Tel
            }, {
              type: 'postback',
              label: '可否用信用卡、國旅卡',
              data: i.Name + ',' + i.CreditCard + ',' + i.TravelCard
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
              data: i.Name + ',' + i.OpenHours + ',' + i.Tel
            }, {
              type: 'postback',
              label: '可否用信用卡、國旅卡',
              data: i.Name + ',' + i.CreditCard + ',' + i.TravelCard
            }]
          })
      } else if (i.Town.includes(event.message.text)) {
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
              data: i.Name + ',' + i.OpenHours + ',' + i.Tel
            }, {
              type: 'postback',
              label: '可否用信用卡、國旅卡',
              data: i.Name + ',' + i.CreditCard + ',' + i.TravelCard
            }]
          })
      }
    }
    if (msg.length === 0) { event.reply('錯誤') } else {
      event.reply({
        type: 'template',
        altText: 'this is a carousel template',
        template: {
          type: 'carousel',
          columns: msg
        }
      })
    }
  } catch (error) {
    msg = '發生錯誤'
  }
})

bot.on('postback', event => {
  const data = event.postback.data.split(',')
  console.log(data[1])
  if (data[0].includes('.')) {
    event.reply({
      type: 'location',
      title: '所在位置',
      address: event.postback.data.split(',')[2],
      latitude: event.postback.data.split(',')[0],
      longitude: event.postback.data.split(',')[1]
    })
  } else if (data[1].includes('True') || data[1].includes('False')) {
    event.reply({
      type: 'text',
      text: '信用卡:' + data[1] + '國旅卡:' + data[2]
    })
  }
})

// bot.on('postback', event => {
//   event.reply({
//     type: 'text',
//     text: event.postback.data
//   })
// })

// bot.on('postback', event => {
//   event.reply({
//     type: 'text',
//     text: event.postback.data
//   })
// })
// 在 port 啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
