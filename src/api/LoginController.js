import send from '../config/MailConfig'
import moment from 'moment'

// 忘记密码功能
class LoginController {
  constructor() {}
  async forget(ctx) {
    const { body } = ctx.request
    console.log(body)
    try {
      let result = await send({
        code: '1234',
        expire: moment()
          .add(30, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss'),
        email: body.username,
        user: 'Brian',
      })
      ctx.body = {
        code: 200,
        data: result,
        msg: '邮件发送成功',
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export default new LoginController()
