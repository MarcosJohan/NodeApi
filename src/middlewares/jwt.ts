import {Request, Response, NextFunction} from 'express';
import config from '../config/config';
import * as jwt from 'jsonwebtoken';

export const checkJwt = (req:Request, res:Response, next:NextFunction) =>{
    const token = <string>req.headers['auth'];
    let jwtpayload;

    try {
        jwtpayload = <any>jwt.verify(token, config.jwtSecret);
        res.locals.jwtpayload = jwtpayload;
    } catch (e) {
        res.status(401).json({message:' Not Authorized'});
    }

    const { id, email } = jwtpayload;
    const newToken = jwt.sign({ id, email }, config.jwtSecret, {expiresIn:'1h'});
    res.setHeader('token', newToken);

    next();
}