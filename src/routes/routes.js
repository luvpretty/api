import combineRoutes from 'koa-combine-routers'

import publicRouter from './publicRouter'
import loginRouter from './loginRouter'
import userRouter from './userRouter'
// 合并后端路由
export default combineRoutes(
    publicRouter, 
    loginRouter,
    userRouter
)
