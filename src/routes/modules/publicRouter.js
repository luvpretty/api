import Router from 'koa-router'
import publicController from '@/api/PublicController'
import contentController from '@/api/ContentController'
import userController from '@/api/UserController'
const router = new Router()

router.prefix('/public')
// 获取图形验证码接口
router.get('/getCaptcha', publicController.getCaptcha)

// 获取文章列表
router.get('/list', contentController.getPostList)

// 获取温馨提醒
router.get('/tips', contentController.getTips)

// 获取友情链接
router.get('/links', contentController.getLinks)

// 获取本周热议
router.get('/topWeek', contentController.getTopWeek)

// 确认修改邮件
router.get('/reset-email', userController.updateUsername)

export default router
