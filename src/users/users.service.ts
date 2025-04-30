import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
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

  async findPatients(psychologistId: number){
    const psychologist = await this.findOne(psychologistId);

    if(!psychologist) {
        throw new NotFoundException('Psicólogo não existe');
    }

    if(psychologist.role !== UserRole.PSICOLOGO) {
        throw new BadRequestException("Este usuário não é um psicólogo");
    }

    const patients = await this.repo
        .createQueryBuilder("user")
        .where("user.psychologist_id = :id", { id: psychologistId})
        .getMany();

    return patients;
  }

  findByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
        throw new NotFoundException('usuário não encontrado');
    }

    Object.assign(user, attrs);
    return this.repo.save(user);
  }
}
