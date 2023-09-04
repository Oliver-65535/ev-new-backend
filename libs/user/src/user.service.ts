import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/entities';
import { EncryptionService } from '@app/encryption-base';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(registrationData: any): Promise<UserEntity[]> {

    const { password, referralCode, ...dataWithoutPassword } = registrationData;
    const passwordHash: string = await EncryptionService.hashPassword(password);

    const createdUser: UserEntity[] = this.userRepository.create({
      ...dataWithoutPassword,
      passwordHash,
    });

    return await this.userRepository.save(createdUser);
  }

  async findByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { id } });
  }
}
