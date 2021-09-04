import {Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn, Column } from 'typeorm';
import {IsNotEmpty, MinLength} from 'class-validator';

@Entity()
@Unique(['id'])
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
    @MinLength(8)
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

    @Column()
    @UpdateDateColumn()
    modificacion : Date; 
}