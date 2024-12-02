// auth.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'
import { User } from '../users/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel('User') private userModel: Model<User>,  // Inject the User model here
    ) { }

    async register(email: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({ email, password: hashedPassword });
        return newUser.save();
    }

    async login(email: string, password: string): Promise<string> {
        const user = await this.userModel.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }
        return this.jwtService.sign({ email, id: user._id });
    }

    // Google Auth
    async validateGoogleUser(user: any) {
        const existingUser = await this.userModel.findOne({ googleId: user.googleId });

        if (!existingUser) {
            const newUser = new this.userModel(user);
            return newUser.save();
        }

        return existingUser;
    }

    async loginWithGoogle(user: any) {
        const payload = { email: user.email, sub: user._id };
        const token = this.jwtService.sign(payload);
        return { token, user };
    }
}
