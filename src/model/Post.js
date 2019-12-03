import mongoose from '../config/DBHelpler'
import moment from 'moment'
const Schema = mongoose.Schema

const PostSchema = new Schema({
  uid: { type: String, ref: 'users' }, // ref联合查询，接要连接表的名称
  title: { type: String },
  content: { type: String },
  created: { type: Date },
  catalog: { type: String },
  fav: { type: String },
  isEnd: { type: String },
  reads: { type: Number },
  answer: { type: Number },
  status: { type: String },
  isTop: { type: String },
  sort: { type: String },
  tags: { type: Array }
})
// 保存时候创建时间格式化
PostSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

PostSchema.statics = {
  /**
  * 获取文章列表数据
  * @param {Object} options 筛选条件
  * @param {String} sort 排序方式
  * @param {Number} page 分页页数
  * @param {Number} limit 分页条数
  */
  getList: function (options, sort, page, limit) {
    return this.find(options)
      .sort({ [sort]: -1 })
      .skip(page * limit)
      .limit(limit)
      // 联合查询
      .populate({
        path: 'uid',
        select: 'nickname isVip pic'
      })
  }
}

const PostModel = mongoose.model('post', PostSchema)

export default PostModel
