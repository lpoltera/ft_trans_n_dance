import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import axios from 'axios';

@Controller('api/auth')
export class AuthController {

  @Get('school42')
  @UseGuards(AuthGuard('school42'))
  school42Login() {
    // Le fournisseur redirige vers cette URL
  }

  @Get('school42/callback')
  @UseGuards(AuthGuard('school42'))
  async school42LoginCallback(@Req() req: any, @Res() res: any) {
// 	const code = req.query.code;

// 	const tokenResponse = await axios.post('https://api.intra.42.fr/oauth/token', {
//     	client_id: process.env.CLIENT_ID,
//     	client_secret: process.env.CLIENT_SECRET,
//     	code,
//     	redirect_uri: 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-7ef49c58d189e83ee65b2e940da7d7c336aea24e1721221e132d3d8eeb3019a8&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Fauth%2Fschool42%2Fcallback&response_type=code',
//     	grant_type: 'authorization_code',
//   });
//   const accessToken = tokenResponse.data.access_token;
	// Vous devrez peut-être ici effectuer des actions telles que la création d'une session utilisateur,
	// la génération d'un jeton JWT, etc., en fonction de votre application.
  
	// Redirigez l'utilisateur vers la page appropriée de votre application après l'authentification réussie.
	// Par exemple, redirigez-le vers la page de profil.
	res.redirect('http://localhost:8000/signup');
  }
}