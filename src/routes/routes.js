import combineRoutes from 'koa-combine-routers'

// import publicRouter from './publicRouter'
// console.log(publicRouter)
// import loginRouter from './loginRouter'
// import userRouter from './userRouter'
// 合并后端路由

const moduleFiles = require.context('./modules', true, /\.js$/)

// modules = moduleFiles.keys()
// [ './loginRouter.js', './publicRouter.js', './userRouter.js' ]
// reduce方法拼接koa-combine-router所需的数据结构Object[]
const modules = moduleFiles.keys().reduce((items, path) => {
  const value = moduleFiles(path)
  console.log(value)
  items.push(value.default)
  return items
}, [])
console.log(modules)
export default combineRoutes(
  modules
//   publicRouter
//   loginRouter,
//   userRouter
)
