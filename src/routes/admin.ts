import { Router } from 'express';
import UserController from '../controller/UserController';
import EquipoController from '../controller/EquipoController';

const router = Router();

//Get all users
router.get('/users', UserController.getAll);

//Get user
router.get('/user', UserController.get);

//Create new user
router.post('/user', UserController.new);

//Edit user
router.patch('/user/:id', UserController.edit);

//Delete user
router.delete('/user/:id', UserController.delete);

//Get all equipos
router.get('/equipos', EquipoController.getAll);

//Get equipo
router.get('/equipo', EquipoController.get);

//Create new equipo
router.post('/equipo', EquipoController.new);

//Edit equipo
router.patch('/equipo/:id', EquipoController.edit);

//Delete equipo
router.delete('/equipo/:id', EquipoController.delete);

export default router;