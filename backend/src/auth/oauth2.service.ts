// import { PassportStrategy} from "@nestjs/passport";
// import { Strategy } from "passport-oauth2";
// import { Injectable } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { Uauth } from "./entities/uauth.entity";

// @Injectable()
// export class Oauth2Strategy extends PassportStrategy(Strategy, 'school42') {
//   constructor(@InjectRepository(Uauth) private uauthRepository: Repository<Uauth>,) {

// 	super({
// 		authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
// 		tokenURL: 'https://api.intra.42.fr/oauth/token',
// 		clientID: process.env.CLIENT_ID,
// 		clientSecret: process.env.CLIENT_SECRET,
// 		callbackURL: 'http://127.0.0.1:8000/api/auth/school42/callback',
// 		scope: 'public',
// 		response_type: 'code',
// 	});
//   }
//   async validate(accessToken: string, refreshToken: string, profile: any) {
// 	// const { id, username } = profile;

// 	// let uauth = await this.uauthRepository.findOne({ where: { school42Id: id } });

//     // if (uauth) {
// 	// 	// Mettre à jour les tokens
// 	// 	uauth.accessToken = accessToken;
// 	// 	uauth.refreshToken = refreshToken;
// 	// 	await this.uauthRepository.save(uauth);
// 	//   } else {
// 	// 	// Créer un nouvel utilisateur
// 	// 	uauth = this.uauthRepository.create({
// 	// 	  school42Id: profile.id,
// 	// 	  accessToken,
// 	// 	  refreshToken,
// 	// 	});
// 	// 	await this.uauthRepository.save(uauth);
// 	//   }
  
// 	//   return Uauth;
//   }
// }

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  async getAccessToken(code: string): Promise<string> {
    const payload = {
      client_id: this.configService.get('CLIENT_ID'),
      client_secret: this.configService.get('CLIENT_SECRET'),
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.configService.get('REDIRECT_URI'),
    };
    
    const { data } = await axios.post('https://api.intra.42.fr/oauth/token', payload);
    return data.access_token;
  }

  async getUserInfo(accessToken: string): Promise<any> {
	const config = {
	  headers: {
		Authorization: `Bearer ${accessToken}`,
	  },
	};
	const { data } = await axios.get('https://api.intra.42.fr/v2/me', config);
	return data;
  }
}
