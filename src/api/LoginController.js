import send from '../config/MailConfig'
import bcrypt from 'bcryptjs'
import moment from 'moment'
import jsonwebtoken from 'jsonwebtoken'
import config from '../config'
import { checkCode } from '../common/Utils'
import User from '../model/User'

class LoginController {
  constructor() { }
  async forget(ctx) {
    const { body } = ctx.request
    console.log(body)
    try {
      // body.username -> database -> email
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

  async login(ctx) {
    // 接收用户的数据
    // 返回token
    const { body } = ctx.request
    let sid = body.sid
    let code = body.code
    // 验证图片验证码的时效性、正确性
    let result = await checkCode(sid, code)
    if (result) {
      // 验证用户账号密码是否正确
      let checkUserPasswd = false
      let user = await User.findOne({ username: body.username })
      if (user.password === body.password) {
        checkUserPasswd = true
      }
      // mongoDB查库
      if (checkUserPasswd) {
        // 验证通过，返回Token数据
        console.log('Hello login')
        let token = jsonwebtoken.sign({ _id: 'luvpretty' }, config.JWT_SECRET, {
          expiresIn: '1d'
        })
        ctx.body = {
          code: 200,
          token: token
        }
      } else {
        // 用户名 密码验证失败，返回提示
        ctx.body = {
          code: 404,
          msg: '用户名或者密码错误'
        }
      }
    } else {
      // 图片验证码校验失败
      ctx.body = {
        code: 401,
        msg: '图片验证码不正确,请检查！'
      }
    }
  }

  async reg(ctx) {
    // 接收客户端的数据
    const { body } = ctx.request
    // 验证图片验证码的时效性、正确性
    let sid = body.sid
    let vercode = body.vercode
    let msg = {}
    let result = await checkCode(sid, vercode)
    let check = true
    if (result) {
    // 查库，看username是否被注册
    let user1 = await User.findOne({email: body.email})
    // console.log(user1)
    if (user1 !== null && typeof user1.email !== 'undefined') {
      msg.email = ['此邮箱已经注册，可以通过邮箱找回密码']
      check = false
    }
    // 查库，看nickname是否被注册
    let user2 = await User.findOne({nickname: body.nickname})
    if (user2 !== null && typeof user2.nickname !== 'undefined') {
      msg.nickname = ['此昵称已经注册，请修改']
      check = false
    }
    // 写入数据到数据库
    if (check) {
      body.password = await bcrypt.hash(body.password, 5)
      let user = new User({
        email: body.email,
        nickname: body.nickname,
        password: body.password,
        created: moment().format('YYYY-MM-DD HH:mm:ss')
      })
      let result = await user.save()
      console.log(result)
      ctx.body = {
        code: 200,
        data: result,
        msg: '注册成功'
      }
      return
    }
    
    } else {
      // veevalidate显示的错误
      msg.code = ['验证码已经失效，请重新获取']
    }
    ctx.body = {
      code: 500,
      msg: msg
    }

  }

}

export default new LoginController()