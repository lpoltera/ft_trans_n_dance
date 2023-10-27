import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Friendship } from './entities/friends.entity';
import { User } from '../user/entities/user.entity';
import { Notification } from '../notifications/entities/notifications.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(User) private readonly userDB: Repository<User>,
    @InjectRepository(Friendship)
    private readonly friendRepository: Repository<Friendship>,
    @InjectRepository(Notification)
    private readonly notifsDB: Repository<Notification>,
  ) {}

  // create(createFriendDto: CreateFriendDto) {
  //   return 'This action adds a new friend';
  // }

  async addFriend(userName: string, friendName: string) {
    const friend = await this.friendRepository.findOne({
      where: [
        {
          user: { username: userName },
          friend: { username: friendName },
          status: 'valider',
        },
        {
          user: { username: friendName },
          friend: { username: userName },
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
          user: { username: userName },
          friend: { username: friendName },
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
        user: { username: friendName },
        friend: { username: userName },
        status: 'pending',
      },
    });
    if (Friend_Not_confirmed) {
      Friend_Not_confirmed.status = 'valider';
      await this.friendRepository.save(Friend_Not_confirmed);

	  const id = Friend_Not_confirmed.id;
      const msgToDelete = await this.notifsDB.findOne({where: {friend: {id : id}}})
	  await this.notifsDB.delete(msgToDelete);
      return "Demande d'ami validé";
    }

    const blockedFriend = await this.friendRepository.findOne({
      where: [
        {
          user: { username: userName },
          friend: { username: friendName },
          status: 'bloquer',
        },
        {
          user: { username: friendName },
          friend: { username: userName },
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
    newFriend.userName = userName;
    newFriend.friendName = friendName;
    newFriend.status = 'pending';
    await this.friendRepository.save(newFriend);

    const notif = this.notifsDB.create({
      sender: userName,
      receiver: friendName,
      message: `${userName} veut être ton ami`,
      status: 'pending',
      friend: newFriend,
    });
    await this.notifsDB.save(notif);

    return "Demande d'ami envoyé";
  }

  async findAll(userName: string) {
    const friendValidate = await this.friendRepository.find({
      where: [
        {
          user: { username: userName },
          status: 'valider',
        },
        {
          friend: { username: userName },
          status: 'valider',
        },
      ],
    });

    const friendValidateOK = friendValidate.map((item) =>
      item.friendName != userName ? item.friendName : item.userName,
    );
    friendValidateOK.unshift(userName); // équivalent de pushback mais pas placé en première place placé selon ordre de l'id

    const userFriends = await this.userDB.find({
      where: {
        username: In(friendValidateOK),
      },
    });
    return userFriends;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} friend`;
  // }

  async update(userName: string, friendName: string, statusToUpdate: string) {
    const friendToUpdate = await this.friendRepository.findOne({
      where: [
        {
          user: { username: userName },
          friend: { username: friendName },
        },
        {
          user: { username: friendName },
          friend: { username: userName },
        },
      ],
    });
    if (friendToUpdate) {
      friendToUpdate.status = statusToUpdate;
      this.friendRepository.save(friendToUpdate);
	  if (friendToUpdate.status === "valider") {
		const id = friendToUpdate.id;
		const msgToDelete = await this.notifsDB.findOne({where: {friend: {id : id}}})
		await this.notifsDB.delete(msgToDelete);
        //envoi notification au sender que la demande a ete acceptée
	  }
      return `The relation between #${userName} and #${friendName} has been updated to ${statusToUpdate}`;
    }
  }
  
  removeAll() {
    return this.friendRepository.clear();
  }
}
