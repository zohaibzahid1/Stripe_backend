import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly jwtService: JwtService,
          ) {}    
    
    // Returns the login URL for Google or Facebook based on the input.
    loginUrl(input: string): string {
        if (input === 'google') {
            const googleAuthUrl = process.env.GOOGLE_AUTH_URL;
            console.log('Google Auth URL:', googleAuthUrl);
            
            if (!googleAuthUrl) {
                throw new Error('GOOGLE_AUTH_URL environment variable is not configured');
            }
            
            return googleAuthUrl;
        }
        if (input === 'facebook') {
            // return String(process.env.FACEBOOK_AUTH_URL);
        }
        throw new Error('Invalid input, please provide either "google" or "facebook".');
    }
    
    // Generates access tokens for the user.
    generateAccessTokens(user: User): string {
        const payload = { sub: user.id, email: user.email };
        
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: '1h', // Token expiration time
        });
    }
    

}