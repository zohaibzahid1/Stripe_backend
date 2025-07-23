import { Module } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { AuthenticationResolver } from './auth.resolver';
import { AuthenticationController } from './auth.controller';
import { UserModule } from '../user/user.module'; // Import the user module to access user services
import { PassportModule } from '@nestjs/passport'; // Import PassportModule for authentication strategies
import { GoogleStrategy } from './strategy/google.strategy'; // Import the Google strategy for OAuth authentication
import { JwtStrategy } from './strategy/jwt.strategy'; // Import the JWT strategy for JWT authentication
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule

@Module({
  providers: [AuthenticationResolver, AuthenticationService, GoogleStrategy, JwtStrategy],
  controllers: [AuthenticationController],
  imports: 
  [   
      PassportModule,
      UserModule, // Import the user module to access user services
      JwtModule.register({
        secret: process.env.JWT_ACCESS_SECRET, // Use the secret from environment variables
        signOptions: { expiresIn: '1h' }, // Set token expiration time
      }),
    ], // Import the user module to access user services
})
export class AuthenticationModule {}

