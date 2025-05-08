import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/user.entity';
import { UserRole } from 'src/common/enums/enums';
import { PsychologistService } from 'src/users/psychologist.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private psychologistService: PsychologistService,
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string; user: Partial<User> }> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('E-mail ou senha incorretos!');
    }

    const payload = { id: user.id, name: user.name, role: user.role, email: user.email, birthdate: user.birthdate };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.usersService.findByEmail(createUserDto.email);

    if (user) {
      throw new BadRequestException('E-mail já cadastrado!');
    }

    const { crp, ...userData } = createUserDto;

    const saltOrRounds = parseInt(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS') || '13',
      10,
    );
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    const newUserData = {
      ...userData,
      password: hashedPassword,
    };

    const createdUser = await this.usersService.create(newUserData);

    if (createUserDto.role === UserRole.PSICOLOGO && crp) {
      await this.psychologistService.create(crp, createdUser);
    }

    return {
      message: 'Usuário cadastrado com sucesso!',
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role,
      },
    };
  }
}
