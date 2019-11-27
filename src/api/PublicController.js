import svgCaptcha from 'svg-captcha'

// 定义图形验证码内容
class PublicController {
  constructor() {}
  async getCaptcha(ctx) {
    const newCaptca = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1il',
      color: true,
      noise: Math.floor(Math.random() * 5),
      width: 150,
      height: 38,
    })
    // console.log(newCaptca)
    ctx.body = {
      code: 200,
      data: newCaptca.data,
    }
  }
}

export default new PublicController()
