import { Request, Response, NextFunction } from 'express';
import { Users } from '../entity/Users';
import { getRepository } from 'typeorm';

export const checkRole = (roles: Array<string>) => {
    return async (req:Request, res:Response, next: NextFunction) =>{
        const { id } = res.locals.jwtPayload;
        const userRepository = getRepository(Users);
        let user : Users;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (e) {
            res.status(401).json({message:'Not authorized!'});
        }

        const { role } = user;

        if(roles.includes(role)){
            next();
        }else{
            res.status(401).json({message:'Not authorized!'});
        }
    }
}