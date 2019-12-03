import Router from 'koa-router'
import publicController from '../api/PublicController'
import ContentControler from '../api/ContentController'
const router = new Router()
// 获取图形验证码接口
router.prefix('/public')

router.get('/getCaptcha', publicController.getCaptcha)
router.get('/list', ContentControler.getPostList)
export default router
