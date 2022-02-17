const axios = require('axios')
const Parse=require('parse/node')  // not sure

const getBase64 = (url) => {
  return axios
    .get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => Buffer.from(response.data, 'binary').toString('base64'))
}


Parse.Cloud.define('sync-steam-avatar', async (request) => {
  const url = 'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/c5/c5d56249ee5d28a07db4ac9f7f60af961fab5426_full.jpg'
  const object = request.user
  const base64 = await getBase64(url)
  object.set('avatar', await new Parse.File(`test.png`, { base64 }).save({}, { useMasterKey: true }))
  await object.save({}, { useMasterKey: true })
})