import { Router } from 'express';
import testController from './controller';

const router = Router();


router.route('/orders').post(testController.testOrder);

router.route('/products').post(testController.testProduct);


export default router;
