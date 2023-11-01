// import { Body, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import axios from 'axios';


// @Controller('api/auth')
// export class AuthController {

//   @Get('school42')
//   @UseGuards(AuthGuard('school42'))
//   school42Login() {
//     // Le fournisseur redirige vers cette URL
//   }

//   @Get('school42/callback')
//   @UseGuards(AuthGuard('school42'))
//   async school42LoginCallback(@Body() data:{code: string}, @Req() req: any, @Res() res: any) {
// 	const code = req.query.code;

// 	const tokenResponse = await axios.post('https://api.intra.42.fr/oauth/token', {
//     	client_id: process.env.CLIENT_ID,
//     	client_secret: process.env.CLIENT_SECRET,
//     	code: code,
//     	redirect_uri: 'http://127.0.0.1:8000/api/auth/school42/callback',
//     	grant_type: 'authorization_code',
//   });
//   const accessToken = tokenResponse.data.access_token;
// 	// Vous devrez peut-être ici effectuer des actions telles que la création d'une session utilisateur,
// 	// la génération d'un jeton JWT, etc., en fonction de votre application.
  
// 	// Redirigez l'utilisateur vers la page appropriée de votre application après l'authentification réussie.
// 	// Par exemple, redirigez-le vers la page de profil.
// 	// res.redirect('http://localhost:8000/signup');
//   }
// }

import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { AuthService } from './oauth2.service';
import { ConfigService } from '@nestjs/config';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('school42')
  @Redirect()
  login() {
    const queryParams = new URLSearchParams({
      client_id: this.configService.get('CLIENT_ID'),
      redirect_uri: this.configService.get('REDIRECT_URI'),
      response_type: 'code',
      scope: 'public',
      state: 'a_very_long_random_string_which_must_be_unguessable',
    }).toString();

    return {
      url: `https://api.intra.42.fr/oauth/authorize?${queryParams}`,
    };
  }

  @Get('school42/callback')
  async callback(@Query('code') code: string, @Query('state') state: string, @Res() res: any) {
	// Vérifiez si l'état correspond à ce que vous avez envoyé pour prévenir les attaques CSRF
	if (state !== 'a_very_long_random_string_which_must_be_unguessable') {
	  // Les états ne correspondent pas; processus doit être interrompu
	  return 'State mismatch; request may be compromised.';
	}
	
	const accessToken = await this.authService.getAccessToken(code);
	const userInfo = await this.authService.getUserInfo(accessToken);
	res.redirect('http://localhost:8000/signup');
	// Faites quelque chose avec userInfo (stockez-le dans la base de données, créez une session, etc.)
  }
}
