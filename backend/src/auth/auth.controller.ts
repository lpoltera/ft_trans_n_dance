import { Controller, Get, Query, Redirect, Res, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
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
  async callback(@Query('code') code: string, @Query('state') state: string, @Res() res: any, @Session() session : Record<string, any>) {
	// Vérifiez si l'état correspond à ce que vous avez envoyé pour prévenir les attaques CSRF
	if (state !== 'a_very_long_random_string_which_must_be_unguessable') {
	  // Les états ne correspondent pas; processus doit être interrompu
	  return 'State mismatch; request may be compromised.';
	}
	
	const accessToken = await this.authService.getAccessToken(code);
	const user42login = await this.authService.getUserLogin(accessToken);

	console.log("USER INFO : ", user42login);
	
	// L'utilisateur existe déjà dans la table userDB
	// comparaison login42 (userInfo) vs login42 userDB
  	const exist = await this.authService.login(user42login, session)
	if (exist === true) {
		res.redirect('http://localhost:8000/accueil');
	}
	else {
		res.redirect('http://localhost:8000/signin');
	}
  }
}
