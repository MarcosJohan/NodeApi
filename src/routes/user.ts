import { Router } from 'express';
import UserController from '../controller/UserController';
import EquipoController from '../controller/EquipoController';
import { checkJwt } from '../middlewares/jwt';
import { checkRole } from '../middlewares/role';

const router = Router();

//Get all users
router.get('/users', [checkJwt, checkRole(['admin'])], UserController.getAll);

//Get user
router.get('/', [checkJwt, checkRole(['admin'])], UserController.get);

//Create new user
router.post('/', [checkJwt, checkRole(['admin'])], UserController.new);

//Edit user
router.put('/:id', [checkJwt, checkRole(['admin'])], UserController.edit);

//Delete user
router.delete('/:id', [checkJwt, checkRole(['admin'])], UserController.delete);

//Get all equipos
router.get('/equipos', [checkJwt,checkRole(['admin', 'gerente', 'analista'])], EquipoController.getAll);

//Get equipo
router.get('/equipo', [checkJwt, checkRole(['admin', 'gerente', 'analista'])], EquipoController.get);

//Create new equipo
router.post('/equipo', [checkJwt, checkRole(['admin', 'gerente', 'analista'])], EquipoController.new);

//Edit equipo
router.put('/equipo/:id', [checkJwt, checkRole(['admin', 'gerente', 'analista'])], EquipoController.edit);

//Delete equipo
router.delete('/equipo/:id', [checkJwt, checkRole(['admin', 'gerente', 'analista'])], EquipoController.delete);

export default router;