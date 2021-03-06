import {Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn, Column } from 'typeorm';
import {IsNotEmpty, MinLength, IsNumber} from 'class-validator';

@Entity()
export class Inventario{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    @IsNotEmpty()
    @MinLength(8)
    rif : string;

    @Column()
    @IsNotEmpty()
    serial : string;
    
    @Column()
    @IsNotEmpty()
    modelo : string;

    @Column()
    @IsNotEmpty()
    @MinLength(5)
    estado : string;
    
    @Column()
    @IsNotEmpty()
    @IsNumber()
    afiliado : number;
    
    @Column()
    @IsNotEmpty()
    @MinLength(5)
    banco : string;
    
    @Column()
    @IsNotEmpty()
    razSoc : string;
    
    @Column()
    @IsNotEmpty()
    localizacion : string;

    @Column()
    nTerm : number;
    
    @Column()
    @IsNotEmpty()
    fantasia : string;

}