import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Users } from '../entity/Users';
import { validate } from 'class-validator';

export class UserController {
    static getAll = async (req:Request, res:Response) => {
        const userRepository = getRepository(Users);
        let users;
        try
        {
            users = await userRepository.find({ select: ['id', 'name', 'apellido', 'ci', 'email', 'role']});
        }catch(e){
            res.status(400).json({message:'Error'});
        }

        if(users.length > 0){
            res.send(users);
        }else{
            res.status(404).json({message:'Not result'});
        }
    };

    static get = async (req:Request, res:Response) => {
        const { name } = req.body;
        const userRepository = getRepository(Users);
        let users;

        try {
            users = await userRepository.find(name);
        } catch (e) {
            res.status(404).json({message:' Not result'})
        }

        if(users.length > 0){
            res.send(users);
        }else{
            res.status(404).json({message:'Not result!'})
        }

    };

    static new = async (req:Request, res:Response) => {
        const {name, apellido, ci, password, email, role} = req.body;
        const userRepository = getRepository(Users);
        const user = new Users();

        user.name = name;
        user.apellido = apellido;
        user.password = password;
        user.ci = ci;
        user.role = role;
        user.email = email;

        const validation = { validationError:{ target:false, value:false }}
        const errors = await validate(user, validation);
        
        if(errors.length > 0){
            return res.status(400).json(errors);
        }

        try {
            user.hashPassword();
            await userRepository.save(user); 
        } catch (e) {
            return res.status(409).json({message:'User already exist!'})
        }

        res.send('User created');
    }; 

    static edit = async (req:Request, res:Response) => {
        let user;
        const {id} = req.params;
        const {name, apellido, ci, email, role} = req.body;
        const userRepository = getRepository(Users);

        //Update user
        try {
            user = await userRepository.findOneOrFail(id);
            user.name = name;
            user.apellido = apellido;
            user.ci = ci;
            user.role = role;
            user.email = email;    
        } catch (e) {
            return res.status(404).json({message:'User not found'});
        }

        //Errors
        const validation = { validationError: { target:false, value:false }};
        const errors = await validate(user, validation);
        
        if(errors.length > 0){
            return res.status(400).json(errors);
        }

        //Save user
        try {
            await userRepository.save(user);
        } catch (error) {
            return res.status(409).json({message:'Data in use'});
        }

        res.status(201).json({message:'User update'});
    };

    static delete = async (req:Request, res:Response) => {
        const {id} = req.params;
        const userRepository = getRepository(Users);
        let user : Users;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (e) {
            return res.status(404).json({message:'User not found'});
        }

        userRepository.delete(id);
        res.status(201).json({message:'User remove'});
    }; 
}

export default UserController;
