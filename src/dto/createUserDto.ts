import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class createUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    name?: string;

    @IsString()
    avatar?: string;

    @IsString()
    googleId?: string;
}