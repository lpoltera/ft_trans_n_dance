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
    async create(newUser: CreateUserDto) {
      try {
        const {avatar, password} = newUser
        let av = avatar
        if (!av)
        av = "default_img"
        const hash = await bcrypt.hash(password, 10)
        const user = this.userDB.create({...newUser,password : hash, avatar : av}) //friends: []
        await this.userDB.save(user)
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
    return user
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
    return await this.userDB.save(user);
  }

  async remove(id: number) {
    return await this.userDB.delete({id});
  }
}