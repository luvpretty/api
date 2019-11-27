import combineRoutes from 'koa-combine-routers'
import publicRouter from './publicRouter'
import loginRouter from './loginRouter'

// 合并后端路由
export default combineRoutes(publicRouter, loginRouter)
