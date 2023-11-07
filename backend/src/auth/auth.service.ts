import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userDB: Repository<User>,
  ) {}

  async getAccessToken(code: string): Promise<string> {
    const payload = {
      client_id: this.configService.get('CLIENT_ID'),
      client_secret: this.configService.get('CLIENT_SECRET'),
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.configService.get('REDIRECT_URI'),
    };

    const { data } = await axios.post(
      'https://api.intra.42.fr/oauth/token',
      payload,
    );
    return data.access_token;
  }

  async getUserLogin(accessToken: string): Promise<any> {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const { data } = await axios.get('https://api.intra.42.fr/v2/me', config);
    return data.login;
  }

  async login(user42name: string, session : Record<string, any>) {
	const user = await this.userDB.findOne({where : {login42 : user42name}})

    if (!user) {
		session.login42 = user42name;
		// créer un nouvel utilisateur avec le user42name dand userDB
		// connected
		console.log("utilisateur n'exite pas")
		return false;
	}
	else {
		session.user = user
		session.connected = true
		session.login42 = user42name;
		user.connected = "connecté";
		this.userDB.save(user)
		console.log("utilisateur exite pas")
		return true;
	}


  }
}
