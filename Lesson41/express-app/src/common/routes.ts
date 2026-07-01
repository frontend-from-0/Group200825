import { Router } from 'express'

const router: Router = Router()

// import routes
import userRouter from '../resources/users/routes'

// Higher level routes definition
router.use('/user', userRouter)
router.use('/products', () => {console.log('products route')})

export default router
