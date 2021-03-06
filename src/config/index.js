import path from 'path'
const DB_URL = 'mongodb://test:123456@49.234.66.66:27000/testdb'
const REDIS = {
  host: '49.234.66.66',
  port: 15000
  // password: '123456'
}
const JWT_SECRET = 'a&*38QthAKuiRwISGLotgq^3%^$zvA3A6Hfr8MF$jM*HY4*dWcwAW&9NGp7*b53!'

const baseUrl = process.env.NODE_ENV === 'production' ? 'http://www.exculibur.cn'
  : 'http://localhost:8080'

const uploadPath = process.env.NODE_ENV === 'production' ? '/app/public'
  : path.join(path.resolve(__dirname), '../../public')
export default {
  DB_URL,
  REDIS,
  JWT_SECRET,
  baseUrl,
  uploadPath
}
