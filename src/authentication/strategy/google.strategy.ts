import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { createUserDto } from 'src/dto/createUserDto';
import { UserService } from 'src/user/user.service';
// Import your UsersService to handle user logic
/**
 * Google OAuth2 Strategy for Passport in NestJS
 * This strategy enables users to sign in via Google OAuth.
 */

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly userService: UserService) {
    
    // Configure the Google strategy with credentials and scopes
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!, // Google OAuth Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Google OAuth Client Secret
      callbackURL: process.env.GOOGLE_CALLBACK_URL!, // URL to redirect to after Google login
      scope: ['profile', 'email'], // Scopes to request from Google
    });
  }

  /**
   * This function runs after Google successfully authenticates the user.
   * It receives the user's profile and tokens, and is responsible for finding or creating the user in our system.
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
 
    const { id, emails, name, photos } = profile;

    const userData = new createUserDto();
    userData.name = name?.givenName || '';
    userData.email = emails?.[0]?.value || '';
    userData.avatar = photos?.[0]?.value || '';
    userData.googleId = id; // Store Google ID for future reference

   const user =  this.userService.findOrCreateOAuthUser(userData); // returning the user object
    
   return user;

  }
}
