import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthenticationService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt-auth.gurad';
@Resolver()
export class AuthenticationResolver {
  constructor(
    private readonly authenticationService: AuthenticationService,
  ) {}
  // Will return the Google authentication URL that the frontend will use to redirect the user
  @Query(() => String)
  getGoogleAuthUrl(): string {
    try {
      console.log('Fetching Google Auth URL');
      const url = this.authenticationService.loginUrl('google');
      console.log('Google Auth URL:', url);
      
      if (!url) {
        throw new Error('Failed to get Google authentication URL');
      }
      
      return url;
    } catch (error) {
      console.error('Error getting Google auth URL:', error);
      throw error;
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtGuard)
  async logout(@Context() context: any): Promise<boolean> {
    try {
      
      const user = context.req.user; // Get user from JWT context
        // On the frontend, check for a successful response and then clear local storage
        if (!user) {
            return false; // User is not authenticated
        }
        
        // Log out successful
        return true; 

    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  }

   @Query(() => Boolean)
   @UseGuards(JwtGuard)
   validateToken(@Context() context: any): boolean {
    // if the JWT guard is used, it will automatically validate the token
    // and attach the user to the request object
    // You can access the user from the request object 
    const response = context.res;
    const user = context.req.user;
    if (!user) {
      return false; // Token is invalid or expired
    }
    return true; // Token is valid
  }  
}

