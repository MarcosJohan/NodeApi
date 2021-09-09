import {Router} from 'express';
import AuthController from '../controller/AuthController';
import { checkJwt } from '../middlewares/jwt';

const router = Router();

router.post('/login', AuthController.login);
router.post('/change', [checkJwt], AuthController.changePassword);

export default router;