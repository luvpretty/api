import Router from 'koa-router'
import publicController from '../api/PublicController'
import ContentControler from '../api/ContentController'
const router = new Router()

router.prefix('/public')
// 获取图形验证码接口
router.get('/getCaptcha', publicController.getCaptcha)
// 获取文章列表
router.get('/list', ContentControler.getPostList)
// 获取温馨提醒
router.get('/tips', ContentControler.getTips)
// 获取友情链接
router.get('/links', ContentControler.getLinks)
// 获取本周热议
router.get('/topWeek', ContentControler.getTopWeek)
export default router
