import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import axios from 'axios';


@Controller('api/auth')
export class AuthController {

  @Get('school42')
  @UseGuards(AuthGuard('school42'))
  school42Login() {
  }

  @Get('school42/callback')
  @UseGuards(AuthGuard('school42'))
  async school42LoginCallback(@Req() req: any, @Res() res: any) {
	 console.log("************** code = ****************");
	const magic = res.query.code;

	const tokenResponse = await axios.post('https://api.intra.42.fr/oauth/token', {
    	client_id: process.env.CLIENT_ID,
    	client_secret: process.env.CLIENT_SECRET,
    	code: '1234',
    	redirect_uri: 'http://localhost:8000/signup',
    	grant_type: magic,
  });
  console.log("token = ", tokenResponse);
  const accessToken = tokenResponse.data.access_token;
  }
}