import mongoose from '../config/DBHelpler'
import moment from 'dayjs'
const Schema = mongoose.Schema

const PostSchema = new Schema({
  uid: { type: String, ref: 'users' }, // ref联合查询，接要连接表的名称
  title: { type: String },
  content: { type: String },
  created: { type: Date },
  catalog: { type: String },
  fav: { type: String },
  isEnd: { type: String, default: '0' },
  reads: { type: Number, default: 0 },
  answer: { type: Number, default: 0 },
  status: { type: String, default: '0' },
  isTop: { type: String, default: '0' },
  sort: { type: String, default: 100 },
  tags: {
    type: Array,
    default: [
      // { name: '', class: '' }
    ]
  }
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
  },
  getTopWeek: function () {
    // 倒序返回七天前评论最多的10条
    return this.find({
      created: {
        $gte: moment().subtract(7, 'days')
      }
    }, {
      answer: 1,
      title: 1
    }).sort({ answer: -1 })
      .limit(10)
  },
  findByTid: function (id) {
    return this.findOne({ _id: id }).populate({
      path: 'uid',
      select: 'nickname pic isVip _id'
    })
  }
}

const PostModel = mongoose.model('post', PostSchema)

export default PostModel
