import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

// src/modules/users/users.service.ts
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<User | null> {
        return await this.userModel.findById(id).exec();
    }

    async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
        await this.userModel.updateOne(
            { _id: userId },
            { refreshToken: refreshToken ? await bcrypt.hash(refreshToken, 10) : null }
        );
    }

    async findAll({ page = 1, limit = 10, search }: {
        page: number;
        limit: number;
        search?: string;
    }) {
        const query = search
            ? {
                $or: [
                    { email: { $regex: search, $options: 'i' } },
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const [users, total] = await Promise.all([
            this.userModel
                .find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.userModel.countDocuments(query)
        ]);

        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
        return await this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .exec();
    }

    async remove(id: string): Promise<UserDocument> {
        return await this.userModel.findByIdAndDelete(id).exec();
    }
}