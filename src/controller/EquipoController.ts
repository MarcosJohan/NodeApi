import { getRepository } from 'typeorm';
import { Request , Response, json } from 'express';
import { validate } from 'class-validator';
import { Inventario } from '../entity/Inventario';

export class EquipoController{
    static getAll = async (req:Request, res:Response) => {
        const iRepository = getRepository(Inventario);
        let inventario;

        try {
            inventario = await iRepository.find();
        } catch (e) {
            return res.status(400).json({message:'Error'});
        }

        if(inventario.length > 0){
            return res.send(inventario);
        }else{
            return res.status(404).json({message:'Not result'});
        }
    };

    static get = async (req:Request, res:Response) => {
        const iRepository = getRepository(Inventario);
        const { fantasia } = req.body;
        let inventario;

        try {
            inventario = await iRepository.findOneOrFail(fantasia);
        } catch (e) {
            return res.status(404).json({message:'Not result'});
        }

        res.send(inventario);
    };

    static new = async (req:Request, res:Response) => {
        const iRepository = getRepository(Inventario);
        const { rif, serial, modelo, estado, afiliado, banco, razSoc, localizacion, nTerm, fantasia} = req.body;
        let inventario : Inventario;

        inventario.rif = rif;
        inventario.serial = serial;
        inventario.modelo = modelo;
        inventario.estado = estado;
        inventario.afiliado = afiliado;
        inventario.banco = banco;
        inventario.razSoc = razSoc;
        inventario.localizacion = localizacion;
        inventario.nTerm = nTerm;
        inventario.fantasia = fantasia;

        const errors = await validate(inventario);

        if(errors.length > 0){
            return res.status(400).json(errors);
        }

        try {
            await iRepository.save(inventario);
        } catch (e) {
            return res.status(409).json({message:'Already exist!'})
        }

        res.send('Cliente register!')
    };

    static edit = async (req:Request, res:Response) => {
        const iRepository = getRepository(Inventario);
        const {id} = req.params;
        const {rif, serial, modelo, estado, afiliado, banco, razSoc, localizacion, nTerm, fantasia} = req.body;
        let inventario : Inventario;

        try {
            inventario = await iRepository.findOneOrFail(id);
            inventario.rif = rif;
            inventario.serial = serial;
            inventario.modelo = modelo;
            inventario.estado = estado;
            inventario.afiliado = afiliado;
            inventario.banco = banco;
            inventario.razSoc = razSoc;
            inventario.localizacion = localizacion;
            inventario.nTerm = nTerm;
            inventario.fantasia = fantasia;
        } catch (e) {
            return res.status(400).json({message:'Error'});
        }

        const errors = await validate(inventario);

        if(errors.length > 0){
            return res.status(400).json(errors);
        }

        try {
            await iRepository.save(inventario);
        } catch (e) {
           return res.status(409).json({message:'Data in use'});
        }

        res.send('User modified');
    };

    static delete = async (req:Request, res:Response) => {
        const iRepository = getRepository(Inventario);
        const {id} = req.params;
        let inventario : Inventario;

        try {
            inventario = await iRepository.findOneOrFail(id);
        } catch (e) {
            return res.status(404).json({message:'Cliente not found'});
        }

        iRepository.delete(id);
        res.status(201).json({message:'Cliente remove'});
    }
}

export default EquipoController;