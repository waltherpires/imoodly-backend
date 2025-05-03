import { InjectRepository } from "@nestjs/typeorm";
import { Psychologist } from "./psychologist.entity";
import { Repository } from "typeorm";
import { User } from "./user.entity";

export class PsychologistService {
    constructor(@InjectRepository(Psychologist) private repo: Repository<Psychologist>) {}

    create(crp: string, user: User) {
        const profile = this.repo.create({ crp, user });
        return this.repo.save(profile);
    }
}