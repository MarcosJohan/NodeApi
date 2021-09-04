import { Router } from 'express';
import admin from './admin';
import analista from './analista';
import gerente from './gerente';
import auth from './auth';

const routes = Router();

routes.use('/auth', auth)
routes.use('/admin', admin);
routes.use('/analista', analista);
routes.use('/gerente', gerente);

export default routes;