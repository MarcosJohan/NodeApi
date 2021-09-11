import {Router} from 'express';
import AuthController from '../controller/AuthController';
import { checkJwt } from '../middlewares/jwt';

const router = Router();

router.post('/login', AuthController.login);

router.post('/change', [checkJwt], AuthController.changePassword);

router.put('/forgot', [checkJwt], AuthController.forgot);

router.put('/new-password', [checkJwt], AuthController.newPassword);

router.post('/refresh-token', [checkJwt], AuthController.refreshToken);

export default router;