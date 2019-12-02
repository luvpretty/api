import svgCaptcha from 'svg-captcha'
import { setValue } from '../config/RedisConfig'
// 定义图形验证码内容
class PublicController {
  async getCaptcha (ctx) {
    const body = ctx.request.query
    console.log(body.sid)
    const newCaptca = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1il',
      color: true,
      noise: Math.floor(Math.random() * 5),
      width: 150,
      height: 38
    })
    // console.log(newCaptca)
    // sid值传入redis,设置图片验证码超时10分钟
    setValue(body.sid, newCaptca.text, 10 * 60)
    ctx.body = {
      code: 200,
      data: newCaptca.data
    }
  }
}

export default new PublicController()
