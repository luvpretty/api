import Router from 'koa-router'
import publicController from '../api/PublicController'

const router = new Router()
// 获取图形验证码接口
router.prefix('/public')

router.get('/getCaptcha', publicController.getCaptcha)

export default router
