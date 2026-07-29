import { Router } from 'express'
import testRouter from '../resources/test/routes';

const router: Router = Router()

// import routes

router.use('/test', testRouter);

// Higher level routes definition

export default router
