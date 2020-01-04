import Post from '../model/Post'
import Links from '../model/Links'
import fs from 'fs'
import uuid from 'uuid/v4'
import moment from 'dayjs'
import config from '@/config'
class ContentController {
  // 获取列表信息
  async getPostList (ctx) {
    const body = ctx.query
    const sort = body.sort ? body.sort : 'created'
    const page = body.page ? parseInt(body.page) : 0
    const limit = body.limit ? parseInt(body.limit) : 20
    const options = {}

    if (typeof body.catalog !== 'undefined' && body.catalog !== '') {
      options.catalog = body.catalog
    }
    if (typeof body.isTop !== 'undefined') {
      options.isTop = body.isTop
    }
    if (typeof body.status !== 'undefined' && body.status !== '') {
      options.isEnd = body.status
    }
    if (typeof body.tag !== 'undefined' && body.tag !== '') {
      // 筛选数组方法elemMatch
      options.tags = { $elemMatch: { name: body.tag } }
    }
    const result = await Post.getList(options, sort, page, limit)
    console.log(result)
    ctx.body = {
      code: 200,
      data: result,
      msg: '获取文章列表成功'
    }
  }

  // 查询友链
  async getLinks (ctx) {
    const result = await Links.find({ type: 'links' })
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 查询温馨提醒
  async getTips (ctx) {
    const result = await Links.find({ type: 'tips' })
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 查询本周热议
  async getTopWeek (ctx) {
    const result = await Post.getTopWeek()
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 上传图片
  async uploadImg (ctx) {
    const file = ctx.request.files.file
    console.log('file: ', file)
    // 图片名称、图片格式、存储位置，返回前台可以读取的路径
    const ext = file.name.split('.').pop()
    console.log('ext: ', ext)
    const dir = `${config.uploadPath}/${moment().format('YYYYMMDD')}`
    console.log('dir: ', dir)
    // 判断路径是否存在，不存在则创建
  }
}
export default new ContentController()
