import { Entity, PrimaryGeneratedColumn, Unique, Column } from 'typeorm';
import { MinLength, IsNotEmpty, IsEmail, IsNumber, IsOptional} from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Entity()
@Unique(['ci'])
@Unique(['email'])
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MinLength(3)
  @IsNotEmpty()
  name : string;

  @Column()
  @IsNotEmpty()
  @MinLength(4)
  apellido : string;

  @Column()
  @IsNotEmpty()
  @MinLength(8)
  @IsNumber()
  ci : number;

  @Column()
  @IsNotEmpty()
  @MinLength(8)
  password : string;

  @Column()
  @IsNotEmpty()
  @MinLength(13)
  @IsEmail()
  email : string;

  @Column()
  @IsNotEmpty()
  @MinLength(5)
  role : string;

  @Column()
  @IsOptional()
  @IsNotEmpty()
  resetToken : string;

  @Column()
  @IsOptional()
  @IsNotEmpty()
  refreshToken : string;

  hashPassword(): void {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }

  checkPassword(password : string): boolean{
    return bcrypt.compareSync(password, this.password);
  }
}
