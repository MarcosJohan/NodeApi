import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Users } from '../entity/Users';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import { validate } from 'class-validator';

class AuthController {
    static login = async (req:Request, res:Response) => {
        const { password, email } = req.body;

        if(!( email && password)){
            return res.status(400).json({message: 'Email and Passsword required!'})
        }
    
        const userRepository = getRepository(Users);
        let user : Users;

        try {
            user = await userRepository.findOneOrFail({where : { email } });
        } catch (e) {
            return res.status(400).json({message: 'Email or Password incorrect!'});
        }

        if(!user.checkPassword(password)){
            return res.status(400).json({message:'Email or password incorrect'});
        }

        const token = jwt.sign({ id: user.id, email: user.email}, config.jwtSecret, { expiresIn:'1h' });
        
        res.json({ token });
    };

    static changePassword = async (req:Request, res:Response) => {
        const { id } = res.locals.jwtPayload;
        const { oldPassword, newPassword } = req.body;

        if(!(oldPassword && newPassword)){
            res.status(400).json({message:'Old password and new password are required'})
        }

        const userRepository = getRepository(Users);
        let user : Users;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (e) {
            res.status(400).json({message:'Something goes wrong!'});
        }

        if (!user.checkPassword(oldPassword)) {
            res.status(401).json({message:'Check your old password'});
        }

        user.password = newPassword;
        const validation = { validationError:{ target:false, value:false}};
        const errors = await validate(user, validation);

        if(errors.length > 0){
            return res.status(400).json(errors);
        }

        user.hashPassword();
        await userRepository.save(user);
        res.json({message:'Password change'});
    };
}

export default AuthController;