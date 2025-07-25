import {Controller,Get,Req,Res,UseGuards,} from '@nestjs/common';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { AuthenticationService } from './auth.service';

  @Controller('authentication')
  export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) {}   
   
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
      // Initiates the Google OAuth2 login flow
      // The actual redirection to Google happens in the guard
    }
    


    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthCallback(@Req() req: any, @Res() res: any) {
      // Handle the callback from Google after authentication
      
      // req.user will contain the authenticated user information attached by google strategy
      const user = req.user;

      // if user is not found, redirect to the frontend with an error message
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL_REDIRECT}?error=authentication_failed`);
      }
      
      // will generate access token and send back to the frontend
      const token = this.authService.generateAccessTokens(user); 

      // Redirect to the frontend application after successful authentication
      return res.redirect(`${process.env.FRONTEND_URL_REDIRECT}?token=${token}`); // the page will acess this token and store it in local storage
    }
}

