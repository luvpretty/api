import Router from 'koa-router'
import userController from '../../api/UserController'
import contentController from '@/api/ContentController'

const router = new Router()

router.prefix('/user')

// 用户签到
router.get('/fav', userController.userSign)

// 更新用户的基本信息
router.post('/basic', userController.updateUserInfo)

// 修改密码
router.post('/change-password', userController.changePasswd)

// 取消 设置收藏
router.get('/set-collect', userController.setCollect)

// 获取收藏列表
router.get('/collect', userController.getCollectByUid)

// 获取用户发贴记录
router.get('/post', contentController.getPostByUid)

// 删除发贴记录
router.get('/delete-post', contentController.deletePostByUid)

// 获取历史消息
router.get('/getmsg', userController.getMsg)

// 设置已读消息
router.get('/setmsg', userController.setMsg)

// 设置
export default router
