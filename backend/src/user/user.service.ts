/* eslint-disable prefer-const */
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { loginDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import { QrCodeService } from '../config/otp.service';
import { UserResponseDto } from './dto/UserResponseDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userDB: Repository<User>,
    private readonly optService: QrCodeService,
  ) {}

  async create(newUser: CreateUserDto, session: Record<string, any>) {
    try {
      let { password, twoFaEnable } = newUser;
      let twoFa: boolean;
      if (twoFaEnable === 'false') {
        twoFa = false;
      } else {
        twoFa = true;
      }

      let log: string = session.login42;
      if (!log) log = 'johndoe';
      if (!session.secret) session.secret = '';
      const hash = await bcrypt.hash(password, 10);
      const user = this.userDB.create({
        ...newUser,
        password: hash,
        connected: 'déconnecté',
        win: 0,
        loss: 0,
        draw: 0,
        totalXP: 0,
        totalGame: 0,
        login42: log,
        twoFaEnable: twoFa,
        secret2fa: session.secret,
      });

      if (twoFaEnable.toString() === 'false') {
        user.connected = 'connecté';
        session.connected = true;
        console.log('twoFaEnable is false');
      }
      await this.userDB.save(user);
      console.log(`twoFaEnable = ${twoFaEnable}`);
      console.log(`user.twoFaEnable = ${user.twoFaEnable}`);
      const userResponse: UserResponseDto = user;
      session.user = userResponse;
      return 'User Created!';
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async login(login: loginDto, session: Record<string, any>) {
    const { username, password } = login;
    const user = await this.userDB.findOne({ where: { username: username } });
    if (!user)
      throw new NotFoundException('Username not found or invalid password');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Username not found or invalid password');
    session.user = user;
    user.connected = 'connecté';
    if (user.twoFaEnable === false) {
      session.connected = true;
    }
    return await this.userDB.save(user);
  }

  async generateQrCode(secret: string, login42: string) {
    const otpauthURL = speakeasy.otpauthURL({
      secret: secret,
      label: 'Pong42',
      encoding: 'base32',
      issuer: login42,
    });

    const QrCode = await this.optService.generateQrCode(otpauthURL);
    return QrCode;
  }

  async twofaCheck(username: string, token: any, session: Record<string, any>) {
    const user = await this.userDB.findOne({ where: { username: username } });
    const userSecret = user.secret2fa;
    console.log(`code google = ${token}`);
    console.log(`userSecret = ${userSecret}`);

    const isValid = speakeasy.totp.verify({
      secret: userSecret,
      encoding: 'base32',
      token: token,
    });

    if (isValid) {
      console.log('Authentication succeeded');
      // session.user = user;
      session.connected = true;
      user.connected = 'connecté';
      this.userDB.save(user);
      return 'Authentication succeeded';
    } else {
      throw new Error('Authentication à foirée');
    }
  }

  async logout(username: string) {
    const user = await this.userDB.findOne({ where: { username: username } });
    if (user) user.connected = 'déconnecté';
    return await this.userDB.save(user);
  }

  async findAll() {
    return await this.userDB.find();
  }

  async findOne(username: string) {
    return await this.userDB.findOneBy({ username });
  }

  async update(
    username: string,
    userUpdate: UpdateUserDto,
    session: Record<string, any>,
  ) {
    try {
      const user = await this.userDB.findOne({ where: { username: username } });
      if (!user) {
        throw new NotFoundException(
          `L'utilisateur avec le nom d'utilisateur "${username}" n'a pas été trouvé.`,
        );
      }

      if (userUpdate.password && userUpdate.password.length > 0) {
        const hash = await bcrypt.hash(userUpdate.password, 10);
        user.password = hash;
        session.user = {
          ...session.user,
          password: user.password,
        };
      }
      if (userUpdate.avatar) {
        user.avatar = userUpdate.avatar;
        session.user = {
          ...session.user,
          avatar: user.avatar,
        };
      }
      if (userUpdate.username) {
        user.username = userUpdate.username;
        session.user = {
          ...session.user,
          username: user.username,
        };
      }
      await this.userDB.save(user);
      return user.username;
    } catch (error) {
      throw new Error(
        `Erreur lors de la sauvegarde de l'utilisateur : ${error.message}`,
      );
    }
  }

  async remove(name: string, session: Record<string, any>) {
    const userToDelete = await this.userDB.findOne({
      where: { username: name },
    });
    if (userToDelete) {
      session.destroy();
      return await this.userDB.softDelete({ id: userToDelete.id });
    }
    return 'User not found';
  }

  async getpodium() {
    const users = await this.userDB.find();
    if (users) {
      users.sort((a: any, b: any) => b.totalXP - a.totalXP);

      const podium = users.slice(0, 3);

      return podium;
    } else return 'erreur podium';
  }
}
