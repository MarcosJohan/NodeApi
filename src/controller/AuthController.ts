import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Users } from '../entity/Users';

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
            return res.status(400).json({message: 'Email or Password incorecct!'});
        }

        res.send(user);
    }
}

export default AuthController;