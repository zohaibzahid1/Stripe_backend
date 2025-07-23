import { Resolver, Query, Mutation, Args ,Context} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { JwtGuard } from 'src/guards/jwt-auth.gurad';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}
    
    // Get all users
    @Query(() => [User])
    async getAllUsers(): Promise<User[]> {
        return this.userService.findAll();
    }

    // Get a user by ID
    @Query(() => User)
    @UseGuards(JwtGuard)
    async getCurrentUser(@Context() context: any): Promise<User | null> {
        const user = context.req.user; 
        console.log('Current user:', user);
        return this.userService.findOne(user.userId);
    }
}
