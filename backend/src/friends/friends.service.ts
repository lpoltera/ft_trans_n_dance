import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Friendship } from './entities/friends.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(User) private readonly userDB: Repository<User>,
    @InjectRepository(Friendship) private readonly friendRepository: Repository<Friendship>,
  ) {}

  // create(createFriendDto: CreateFriendDto) {
  //   return 'This action adds a new friend';
  // }

  async addFriend(userId: number, friendUserId: number) {
    const friend = await this.friendRepository.findOne({
      where: [
        {
          user: { id: userId },
          friend: { id: friendUserId },
          status: 'valider',
        },
        {
          user: { id: friendUserId },
          friend: { id: userId },
          status: 'valider',
        },
      ],
    });
    if (friend) {
      throw new ForbiddenException('Vous êtes déjà ami avec cette personne.');
    }

    const already_ask = await this.friendRepository.findOne({
      where: [
        {
          user: { id: userId },
          friend: { id: friendUserId },
          status: 'pending',
        },
      ],
    });
    if (already_ask) {
      throw new ForbiddenException(
        'Vous avez déjà fait une demande à ce joueur.',
      );
    }
    const Friend_Not_confirmed = await this.friendRepository.findOne({
      where: {
        user: { id: friendUserId },
        friend: { id: userId },
        status: 'pending',
      },
    });
    if (Friend_Not_confirmed) {
      Friend_Not_confirmed.status = 'valider';
      this.friendRepository.save(Friend_Not_confirmed);
      return "Demande d'ami validé";
    }

    const blockedFriend = await this.friendRepository.findOne({
      where: [
        {
          user: { id: userId },
          friend: { id: friendUserId },
          status: 'bloquer',
        },
        {
          user: { id: friendUserId },
          friend: { id: userId },
          status: 'bloquer',
        },
      ],
    });
    if (blockedFriend) {
      throw new ForbiddenException(
        "L'utilisateur vous a bloqué, vous ne pouvez pas l'ajouter comme ami.",
      );
    }

    const newFriend = new Friendship();
    newFriend.userId = userId;
    newFriend.friendId = friendUserId;
    newFriend.status = 'pending';
    this.friendRepository.save(newFriend);
    return "Demande d'ami envoyé";
  }

  async findAll(userId: number) {
    const friendValidate = await this.friendRepository.find({
      where: [
        {
          user: { id: userId },
          status: 'valider',
        },
        {
          friend: { id: userId },
          status: 'valider',
        },
      ],
    });

    const friendValidateOK = friendValidate.map(item => item.friendId != userId ? item.friendId : item.userId);
    friendValidateOK.unshift(userId);

    const userFriends = await this.userDB.find({
      where: {
        id: In(friendValidateOK),
      },
    });
    return userFriends;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} friend`;
  // }

  
  async update(userId: number, friendUserId: number, statusToUpdate: string) {
    const friendToUpdate = await this.friendRepository.findOne({
      where: [
        {
          user: { id: userId },
          friend: { id: friendUserId },
        },
        {
          user: { id: friendUserId },
          friend: { id: userId },
        },
      ],
    });
    if (friendToUpdate) {
      friendToUpdate.status = statusToUpdate;
      this.friendRepository.save(friendToUpdate);
      return `The relation between #${userId} and #${friendUserId} has been updated to ${statusToUpdate}`;
    }
  }
  removeAll() {
    this.friendRepository.clear();
    return 'All friends removed';
  }
}
