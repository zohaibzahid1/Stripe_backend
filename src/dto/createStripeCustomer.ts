import { IsEmail, IsString,IsNotEmpty } from 'class-validator';

export class CreateStripeCustomerDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}