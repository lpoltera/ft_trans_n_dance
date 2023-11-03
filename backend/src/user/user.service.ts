import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { loginDto } from './dto/login-user.dto'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'


@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(User) private readonly userDB: Repository<User>, 
    ) {}

    async create(newUser: CreateUserDto, session : Record<string, any>) {
      try {
        const {avatar, password} = newUser
		let log: string = session.login42;
		if (!log)
		log = "johndoe";
        let av = avatar
        if (!av)
        av = "src/assets/avatar-cat.png"
        const hash = await bcrypt.hash(password, 10)
        const user = this.userDB.create({...newUser,password: hash, avatar: av, connected: "déconnecté", win: 0, loss: 0, draw: 0, totalXP: 0, totalGame: 0, login42: log})
        await this.userDB.save(user)
        session.user = user;
        session.connected = "connecté";
        return "User Created!"
    } catch (error) {
        throw new ConflictException(error.message)
    }
  }
  
  async login(login: loginDto) {
    const {username, password} = login
    const user = await this.userDB.findOne({where : {username : username}})
    if (!user)
      throw new NotFoundException("Username not found or invalid password")
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedException("Username not found or invalid password")
	user.connected = "connecté";
    return await this.userDB.save(user)
  }

  async logout(username: string) {
	const user = await this.userDB.findOne({where : {username : username}});
  if (user)
	user.connected = "déconnecté";
	return await this.userDB.save(user);
  }
  
  async findAll() {
    return await this.userDB.find();
  }
  
  async findOne(username:string) {
    return  await this.userDB.findOneBy({username});
  }

  async update(username:string, userUpdate: UpdateUserDto) {
    const user = await this.userDB.findOne({where : {username : username}});
    if (!user) {
      throw new NotFoundException(`L'utilisateur avec le nom d'utilisateur "${username}" n'a pas été trouvé.`);
    }
    if (userUpdate.password) {
      const hash = await bcrypt.hash(userUpdate.password, 10)
      user.password = hash;
    }
    if (userUpdate.avatar) {
      user.avatar = userUpdate.avatar;
    }
    if(userUpdate.totalXP) {
      user.totalXP = userUpdate.totalXP;
    } 
    return await this.userDB.save(user);
  }

  async remove(id: number) {
    return await this.userDB.delete({id});
  }

  async getpodium() {
    const users = await this.userDB.find();
    if (users) {
      users.sort((a: any, b: any) => b.totalXP - a.totalXP);
  
      const podium = users.slice(0, 3);
  
      return podium;
    }
    else
      return "erreur podium";


  }
}