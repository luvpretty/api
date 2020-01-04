import Post from '../model/Post'
import Links from '../model/Links'
import fs from 'fs'
import uuid from 'uuid/v4'
import moment from 'dayjs'
import config from '@/config/index'
import mkdir from 'make-dir'
// import { dirExists } from '@/common/Utils'
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
    // 读取图片文件内容
    const file = ctx.request.files.file
    // 图片格式
    const ext = file.name.split('.').pop()
    console.log('ext: ', ext)
    // 图片路径
    const dir = `${config.uploadPath}/${moment().format('YYYYMMDD')}`
    console.log('dir哈哈哈: ', dir)
    // 判断路径是否存在，不存在则创建
    await mkdir(dir)
    // 给文件一个唯一的名称
    const picname = uuid()
    // 存储文件到指定的路径
    const destPath = `${dir}/${picname}.${ext}`
    console.log(destPath)
    // 读文件流
    const reader = fs.createReadStream(file.path)
    // 写文件流
    const upStream = fs.createWriteStream(destPath)
    const filePath = `/${moment().format('YYYYMMDD')}/${picname}.${ext}`
    reader.pipe(upStream)
    ctx.body = {
      code: 200,
      mag: '图片上传成功',
      data: filePath
    }
  }
}
export default new ContentController()
