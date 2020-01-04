import Router from 'koa-router'
import contentController from '@/api/ContentController'

const router = new Router()

router.prefix('/content')

router.post('/upload', contentController.uploadImg)

export default router
