const Gyazo  = require('gyazo-api')
const exif = require('exif2')
const moment = require('moment')
const Koa = require('koa')

const app = Koa()
const GyazoClient = new Gyazo(process.env.GYAZO_TOKEN)

const getExif = (filepath) => new Promise((resolve) => {
  exif(filepath, (err, obj) => {
    resolve(obj)
  })
})


app.use(function *() {
  const filepath = './DSC00001.JPG'
  const data = yield getExif(filepath)
  const unixtime = moment(data['date time original'], 'YYYY:MM:DD HH:mm:ss').unix()
  const response = yield GyazoClient.upload(filepath, {created_at: unixtime})
  this.body = response.data.permalink_url
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Listen on localhost:' + port)
})
