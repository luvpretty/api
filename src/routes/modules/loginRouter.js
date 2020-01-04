import Router from 'koa-router'
import loginController from '@/api/LoginController'

const router = new Router()

router.prefix('/login')
// 忘记密码接口
router.post('/forget', loginController.forget)

// 登录接口
router.post('/login', loginController.login)

// 注册接口
router.post('/reg', loginController.reg)
export default router
