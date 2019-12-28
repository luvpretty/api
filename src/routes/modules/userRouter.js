import Router from 'koa-router'
import UserController from '@/api/UserController'

const router = new Router()

router.prefix('/user')

// 用户签到
router.get('/fav', UserController.userSign)

export default router
