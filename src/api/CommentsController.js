import Comments from '../model/Comments'
import CommentsHands from '../model/CommentsHands'
import Post from '../model/Post'
import User from '../model/User'
import { checkCode, getJWTPayload } from '../common/Utils'

const canReply = async (ctx) => {
  let result = false
  const obj = await getJWTPayload(ctx.header.authorization)
  if (typeof obj._id === 'undefined') {
    return result
  } else {
    const user = await User.findByID(obj._id)
    if (user.status === '0') {
      result = true
    }
    return result
  }
}

class CommentsController {
  // 获取评论列表 读取评论内容即点赞回复信息
  async getComments (ctx) {
    const params = ctx.query
    const tid = params.tid
    const page = params.page ? params.page : 0
    const limit = params.limit ? parseInt(params.limit) : 10
    let result = await Comments.getCommentsList(tid, page, limit)
    // 获取完列表之后，判断用户是否登录，已登录的用户才去判断点赞信息
    let obj = {}
    if (typeof ctx.header.authorization !== 'undefined') {
      obj = await getJWTPayload(ctx.header.authorization)
    }
    if (typeof obj._id !== 'undefined') {
      result = result.map(item => item.toJSON())
      result.forEach(async (item) => {
        item.handed = '0'
        const commentsHands = await CommentsHands.findOne({ cid: item._id, uid: obj._id })
        if (commentsHands && commentsHands.cid) {
          if (commentsHands.uid === obj._id) {
            item.handed = '1'
          }
        }
      })
    }
    const total = await Comments.queryCount(tid)
    ctx.body = {
      code: 200,
      total,
      data: result,
      msg: '查询成功'
    }
  }

  // 添加评论
  async addComment (ctx) {
    const check = await canReply(ctx)
    if (!check) {
      ctx.body = {
        code: 500,
        msg: '用户已被禁言！'
      }
      return
    }
    const { body } = ctx.request
    const sid = body.sid
    const code = body.code
    // 验证图片验证码的时效性、正确性
    const result = await checkCode(sid, code)
    if (!result) {
      ctx.body = {
        code: 401,
        msg: '图片验证码不正确，请检查！'
      }
      return
    }
    const newComment = new Comments(body)
    const obj = await getJWTPayload(ctx.header.authorization)
    newComment.cuid = obj._id
    const comment = await newComment.save()
    // 添加评论之后,新增评论计数
    const updatePostResult = await Post.updateOne({ _id: body.tid }, { $inc: { answer: 1 } })
    if (comment._id && updatePostResult.ok === 1) {
      ctx.body = {
        code: 200,
        data: comment,
        msg: '评论成功'
      }
    } else {
      ctx.body = {
        code: 500,
        data: comment,
        msg: '评论失败'
      }
    }
  }

  // 编辑评论
  async updateComment (ctx) {
    const check = await canReply(ctx)
    if (!check) {
      ctx.body = {
        code: 500,
        msg: '用户已被禁言！'
      }
      return
    }
    const { body } = ctx.request
    const result = await Comments.updateOne({ _id: body.cid }, { $set: body })
    ctx.body = {
      code: 200,
      data: result,
      msg: '修改成功'
    }
  }

  // 采纳评论
  async setBest (ctx) {
    // 对用户权限的判断， post uid -> header id
    const obj = await getJWTPayload(ctx.header.authorization)
    console.log(obj)
    if (typeof obj === 'undefined' && obj._id !== '') {
      ctx.body = {
        code: '401',
        msg: '用户未登录，或者用户未授权'
      }
      return
    }
    const params = ctx.query
    const post = await Post.findOne({ _id: params.tid })
    if (post.uid === obj._id && post.isEnd === '0') {
      // 只有作者本人可以去设置采纳isBest
      const result = await Post.updateOne({ _id: params.tid },
        { $set: { isEnd: '1' } })
      const result1 = await Comments.updateOne({ _id: params.cid },
        { $set: { isBest: '1' } })
      // 更新成功
      if (result.ok === 1 && result1.ok === 1) {
        // 把积分值给采纳的用户
        const comment = await Comments.findByCid(params.cid)
        const result2 = await User.updateOne({ _id: comment.cuid }, { $inc: { favs: parseInt(post.fav) } })
        if (result2.ok === 1) {
          ctx.body = {
            code: 200,
            msg: '设置成功',
            data: result2
          }
        } else {
          ctx.body = {
            code: 500,
            msg: '设置最佳答案-更新用户失败'
          }
        }
      } else {
        ctx.body = {
          code: 500,
          msg: '设置失败',
          data: { ...result, ...result1 }
        }
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '帖子已结帖，无法重复设置'
      }
    }
  }

  // 评论点赞
  async setHands (ctx) {
    const obj = await getJWTPayload(ctx.header.authorization)
    const params = ctx.query
    // 判断用户是否已经点赞
    const tmp = await CommentsHands.find({ cid: params.cid, uid: obj._id })
    if (tmp.length > 0) {
      ctx.body = {
        code: 500,
        msg: '您已经点赞，请勿重复点赞'
      }
      return
    }
    // 新增一条点赞记录
    const newHands = new CommentsHands({
      cid: params.cid,
      uid: obj._id
    })
    const data = await newHands.save()
    // 更新comments表中对应的记录的hands信息 + 1
    const result = await Comments.updateOne({ _id: params.cid }, { $inc: { hands: 1 } })
    if (result.ok === 1) {
      ctx.body = {
        code: 200,
        msg: '点赞成功',
        data: data
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '保存点赞记录失败'
      }
    }
  }
}

export default new CommentsController()
