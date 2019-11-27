import Router from 'koa-router'
import loginController from '../api/LoginController'

const router = new Router()
// 忘记密码接口
router.prefix('/login')
router.post('/forget', loginController.forget)
router.post('/login', loginController.login)

export default router
