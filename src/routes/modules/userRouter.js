import Router from 'koa-router'
import UserController from '@/api/UserController'

const router = new Router()

router.prefix('/user')

// 用户签到
router.get('/fav', UserController.userSign)

// 更新用户基本信息
router.post('/basic', UserController.updateUserInfo)

// 修改密码
router.post('/change-password', UserController.changePasswd)
export default router
