import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Users } from '../entity/Users';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import { validate } from 'class-validator';
import {transporter} from '../config/mailer'

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

        const token = jwt.sign({ userId: user.id, email: user.email}, config.jwtSecret, { expiresIn:'1h' });
        const refreshToken = jwt.sign({userId: user.id, email: user.email}, config.jwtSecretRefresh, {expiresIn:'1h'});
        user.refreshToken = refreshToken;

        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(400).json({message:'Somethign goes wrong'});
        }
        
        res.json({ token, refreshToken, role: user.role });
    };

    static changePassword = async (req:Request, res:Response) => {
        const { userId } = res.locals.jwtPayload;
        const { oldPassword, newPassword } = req.body;

        if(!(oldPassword && newPassword)){
            res.status(400).json({message:'Old password and new password are required'})
        }

        const userRepository = getRepository(Users);
        let user : Users;

        try {
            user = await userRepository.findOneOrFail(userId);
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

    static forgot = async (req:Request, res:Response) => {
        const {email} = req.body;

        if(!email){
            return res.status(400).json({message:'Email is required'})
        }

        const message = 'Check you email for a link to reset you password';
        let verificationLink;
        let emailStatus = 'OK';

        const userRepository = getRepository(Users);
        let user : Users;

        try {
            user = await userRepository.findOneOrFail({ where: { email } });
            const token = jwt.sign({userId:user.id, email:user.email}, config.jwtSecretReset, { expiresIn:'5m'});
            verificationLink = `http://localhost:4200/new-password/${token}`; 
            user.resetToken = token;
        } catch (e) {
            return res.status(400).json({message:'Email not exist'});
        }

        //Send Email
        try {
       /*     await transporter.sendMail({
                from:'Recuperar contraseña <@gmail.com>',
                to: user.email,
                subject: 'Recuperar contraseña',
                html:`
                <b>Please click on the following link, or paste this into your browse to complete the process:</b>
                <a href="${verificationLink}">Click me</a>
                `,
            });
        */
        } catch (e) {
            emailStatus = e;
            return res.status(400).json({message:'Somethign goes wrong'});
        }


        try {
            await userRepository.save(user);
        } catch (e) {
            emailStatus = e;
            return res.status(400).json({message:'Something woes wrong'});
        }

        return res.json({message, info: emailStatus});
    };

    static newPassword = async (req:Request, res:Response) => {
        const {newPassword} = req.body;
        const resetToken = req.headers['reset'] as string;

        if(!(resetToken && newPassword)){
            return res.status(400).json({message:'Los datos son nesesarios'});
        }

        const userRepository = getRepository(Users);
        let jwtPayload;
        let user : Users;

        try {
            jwtPayload = jwt.verify(resetToken, config.jwtSecretReset);
            user = await userRepository.findOneOrFail({ where:{resetToken}});
        } catch (e) {
            return res.status(401).json({message:'Ha tartado mucho tiempo intente de nuevo'})
        }

        user.password = newPassword;
        const validation = {validationError: {target:false, value:false}};
        const errors = await validate(user, validation);

        if(errors.length > 0){
            return res.status(400).json(errors);
        }

        try {
            user.hashPassword();
            await userRepository.save(user);
        } catch (e) {
            return res.status(400).json({message:'Somethign goes wrong'}); 
        }

        res.json({message:'Password change'});
    };

    static refreshToken = async (req:Request, res:Response)=> {
        const refreshToken = req.headers.refreshToken as string;
        
        if(!(refreshToken)){
            res.status(400).json({message:'Something goes wrong'});
        }

        const userRepository = getRepository(Users);
        let user : Users;

        try {
            const verify = await jwt.verify(refreshToken, config.jwtSecretRefresh);
            const {email} = verify as Users;
            user = await userRepository.findOneOrFail({where:{email}});
        } catch (e) {
            res.status(400).json({message:'Something goes wrong'});
        }

        const token = jwt.sign({userId: user.id, email: user.email}, config.jwtSecret, {expiresIn:'1h'});

        res.json({message:'OK', token});
    };
}

export default AuthController;