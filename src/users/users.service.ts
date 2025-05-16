import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from 'src/common/enums/enums';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(createUserDto: CreateUserDto) {
    const user = this.repo.create(createUserDto);
    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
        throw new NotFoundException('usuário não encontrado');
    }

    if (attrs.email) {
      const existingUser = await this.findByEmail(attrs.email);
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('E-mail já cadastrado!');
      }
    }

    Object.assign(user, attrs);
    return this.repo.save(user);
  }

}
