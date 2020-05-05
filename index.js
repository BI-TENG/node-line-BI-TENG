// 引用 linebot 套件
import linebot from 'linebot'
// 引用 dotenv 套件
import dotenv from 'dotenv'

import kkbox from '@kkbox/kkbox-js-sdk'

const Api = kkbox.Api
const Auth = kkbox.Auth

// 讀取 env 檔
dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

let kkboxToken = ''

const getToken = async () => {
  const auth = new Auth(process.env.KKBOX_ID, process.env.KKBOX_SECRET)
  await auth.clientCredentialsFlow
    .fetchAccessToken()
    .then(response => {
      kkboxToken = response.data.access_token
    })
}

getToken()

// // 當收到訊息時
// bot.on('message', function (event) {
//   if (event.message.type === 'text') {
//     event.source.profile().then(function (profile) {
//       event.reply(profile.displayName + '你再說一次試試看')
//     })
//   }
// })

bot.on('message', async (event) => {
  let msg = ''
  const search = event.message.text
  try {
    // Create an API object with your access token
    const api = new Api(kkboxToken)

    // Fetch content with various fetchers
    await api.searchFetcher
      .setSearchCriteria(search, 'track')
      .fetchSearchResult()
      .then(response => {
        // 搜尋圖片
        console.log(response.data.tracks.data[0].album.images)
        msg = response.data.tracks.data[0].album.images
      })
  } catch (error) {
    msg = '發生錯誤'
  }
  for (let i = 0; i < msg.length; i++) {
    await event.reply({
      type: 'image',
      originalContentUrl: msg[i].url,
      previewImageUrl: msg[i].url
    })
  }
})

// 在 port 啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
