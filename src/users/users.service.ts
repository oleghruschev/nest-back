import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from 'src/users/dto/add-role.dto';
import { BanUserDto } from 'src/users/dto/ban-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private rolesService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.rolesService.getRoleByValue('USER');

    await user.$set('roles', [role.id]);

    user.roles = [role];

    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({
      include: {
        all: true,
      },
    });

    return users;
  }

  async getUserByEmail(email: string) {
    const user = this.userRepository.findOne({
      where: {
        email,
      },
      include: {
        all: true,
      },
    });

    return user;
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.rolesService.getRoleByValue(dto.value);

    if (role && user) {
      // добавляем значение в базу данных
      await user.$add('role', role.id);

      return dto;
    }

    throw new HttpException(
      'Пользователь или роль не найдены',
      HttpStatus.NOT_FOUND,
    );
  }

  async ban(dto: BanUserDto) {
    const user = await this.userRepository.findByPk(dto.userId);

    if (user) {
      user.isBanned = true;
      user.banReason = dto.banReason;

      // сохраняем изменения в базу данных
      await user.save();

      return user;
    }

    throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
  }
}
