import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { createUserDto } from 'src/dto/createUserDto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
    
    async findOne(id: string): Promise<User|null> {
        return this.userRepository.findOne({ where: { id } });
    }

    
    // This method finds an existing user by email or creates a new one if it doesn't exist.
    // used in google.strategy.ts
    async findOrCreateOAuthUser(profile: createUserDto): Promise<User> {
        let user = await this.userRepository.findOne({ where: { email: profile.email } });
        if (!user) {
            user = this.userRepository.create(profile);
            await this.userRepository.save(user);
        }
        return user;
    }

    async update(id: string, updateData: Partial<User>) {
        await this.userRepository.update(id, updateData);
    }
    async updateOneTimePaymentStatus(id: string, status: boolean): Promise<boolean> {
        
        if (await this.userRepository.update(id, { hasOneTimePaid : status })) {
            return true;
        }
        return false;
    }
    async remove(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}