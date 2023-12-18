import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Friendship } from './entities/friends.entity';
import { User } from '../user/entities/user.entity';
import { Notification } from '../notifications/entities/notifications.entity';
import { relationDto } from './dto/relation.dto';
import { UserResponseDto } from 'src/user/dto/UserResponseDto';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(User) private readonly userDB: Repository<User>,
    @InjectRepository(Friendship)
    private readonly friendRepository: Repository<Friendship>,
    @InjectRepository(Notification)
    private readonly notifsDB: Repository<Notification>,
  ) {}

  async findFriendship(userName: string, friendName: string, status: string) {
    const friendship = await this.friendRepository.findOne({
      where: [
        {
          user: { username: userName },
          friend: { username: friendName },
          status,
        },
        {
          user: { username: friendName },
          friend: { username: userName },
          status,
        },
      ],
    });
    if (!friendship) {
      return false;
    }
    return true;
    //   return {
    //     friendship: null,
    //     isSender: '',
    //   };
    // }
    // return {
    //   friendship,
    //   isSender: friendship?.user.username === userName,
    // };
  }

  async addFriend(userName: string, friendName: string) {
    const existingRelation = await this.findFriendship(
      userName,
      friendName,
      'valider',
    );
    console.log('Realtion = ', existingRelation);
    if (existingRelation === true) {
      throw new ForbiddenException('Vous êtes déjà ami avec cette personne.');
    }

    const alreadyAsked = await this.friendRepository.findOne({
      where: {
        user: { username: userName },
        friend: { username: friendName },
        status: 'pending',
      },
    });
    if (alreadyAsked) {
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

      const msgToDelete = await this.notifsDB.findOne({
        where: { friend: { id: Friend_Not_confirmed.id } },
      });
      await this.notifsDB.delete(msgToDelete);
      return "Demande d'ami validé";
    }

    const isblocked = await this.findFriendship(
      userName,
      friendName,
      'blocked',
    );
    if (isblocked === true) {
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
      message: `Tu as reçu une demande d'ami de ${userName}`,
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

    const userFriends = await this.userDB.find({
      where: {
        username: In(friendValidateOK),
      },
    });
    return userFriends;
  }

  async findBlocked(username: string) {
    const blockedValidate = await this.friendRepository.find({
      where: [
        {
          user: { username: username }, // blockedBy === username
          status: 'blocked',
        },
        {
          friend: { username: username },
          status: 'blocked',
        },
      ],
    });
    const blockedValidateOK = blockedValidate.map((item) =>
      item.friendName != username ? item.friendName : item.userName,
    );
    // blockedValidateOK.unshift(username); // équivalent de pushback mais pas placé en première place placé selon ordre de l'id

    const userFriends = await this.userDB.find({
      where: {
        username: In(blockedValidateOK),
      },
    });
    return userFriends;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} friend`;
  // }

  async update(userName: string, friendName: string, statusToUpdate: string) {
    //indiquer qui a bloqué (rajouter un champ blockedBy dans la table) - remettre à null après déblocage
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
      const previous_status = friendToUpdate.status;
      friendToUpdate.status = statusToUpdate;
      this.friendRepository.save(friendToUpdate);
      if (
        (friendToUpdate.status === 'valider' &&
          previous_status === 'pending') ||
        (friendToUpdate.status === 'refuser' && previous_status === 'pending')
      ) {
        const id = friendToUpdate.id;
        const msgToDelete = await this.notifsDB.findOne({
          where: { friend: { id: id } },
        });
        await this.notifsDB.delete(msgToDelete);
        //envoi notification au sender que la demande a ete acceptée
      }
      return `The relation between #${userName} and #${friendName} has been updated to ${statusToUpdate}`;
    }
  }

  removeAll() {
    return this.friendRepository.clear();
  }

  async getRelations(username: string): Promise<relationDto[]> {
    const relations = await this.friendRepository.find({
      where: [
        {
          user: { username: username },
        },
        {
          friend: { username: username },
        },
      ],
    });
    const friends = [];
    for (const relation of relations) {
      const friendUsername =
        relation.userName === username
          ? relation.friendName
          : relation.userName;
      const senderUsername = relation.userName;
      const friend = await this.userDB.findOne({
        where: { username: friendUsername },
      });
      if (!friend || friend.username === username) {
        continue;
      }
      const friendResponse: UserResponseDto = {
        id: friend.id,
        username: friend.username,
        connected: friend.connected,
        avatar: friend.avatar,
        win: friend.win,
        loss: friend.loss,
        draw: friend.draw,
        totalXP: friend.totalXP,
        totalGame: friend.totalGame,
      };
      friends.push({
        friend: friendResponse,
        status: relation.status,
        sender: senderUsername,
      });
    }
    console.log(friends);
    return friends;
  }
}
