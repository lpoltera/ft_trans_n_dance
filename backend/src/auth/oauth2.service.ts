import { PassportStrategy} from "@nestjs/passport";
import { Strategy } from "passport-oauth2";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Uauth } from "./entities/uauth.entity";

@Injectable()
export class Oauth2Strategy extends PassportStrategy(Strategy, 'school42') {
  constructor(@InjectRepository(Uauth) private uauthRepository: Repository<Uauth>,) {

	super({
		authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
		tokenURL: 'https://api.intra.42.fr/oauth/token',
		clientID: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		callbackURL: 'http://localhost:8000/api/auth/school42/callback',
		// scope: 'public',
		// response_type: '1234',
	});
  }
  async validate(accessToken: string, refreshToken: string, profile: any) {
	  console.log("********* profile : ", profile, "****************");
	// const { id, username } = profile;

	// let uauth = await this.uauthRepository.findOne({ where: { school42Id: id } });

    // if (uauth) {
	// 	// Mettre à jour les tokens
	// 	uauth.accessToken = accessToken;
	// 	uauth.refreshToken = refreshToken;
	// 	await this.uauthRepository.save(uauth);
	//   } else {
	// 	// Créer un nouvel utilisateur
	// 	uauth = this.uauthRepository.create({
	// 	  school42Id: profile.id,
	// 	  accessToken,
	// 	  refreshToken,
	// 	});
	// 	await this.uauthRepository.save(uauth);
	//   }
  
	//   return Uauth;
  }
}