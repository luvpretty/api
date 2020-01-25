import Router from 'koa-router'
import commentsController from '@/api/commentsController'

const router = new Router()

router.prefix('/comments')

// 添加评论
router.post('/reply', commentsController.addComment)

// 更新评论
router.post('/update', commentsController.updateComment)

// 设置最佳答案
router.get('/accept', commentsController.setBest)

// 评论点赞
router.get('/hands', commentsController.setHands)
export default router
