import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import {
  CreateUserDto,
  UpdateUserDto,
  UserQueryDto,
  UserListResponseDto,
  UserDto,
} from './dto';
import * as bcrypt from 'bcrypt';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private i18nService: I18nService,
  ) {}

  private mapUserToDto(user: UserDocument): UserDto {
    const userObject = user.toObject(); // Mongoose dokümanını düz objeye çevir

    return {
      id: userObject._id.toString(),
      email: userObject.email,
      firstName: userObject.firstName,
      lastName: userObject.lastName,
      phone: userObject.phone
        ? {
            countryCode: userObject.phone.countryCode,
            number: userObject.phone.number,
          }
        : undefined,
      roles: userObject.roles?.map((role) =>
        typeof role === 'string' ? role : role.name,
      ),
      isEmailVerified: userObject.isEmailVerified,
      createdAt: userObject.createdAt,
      updatedAt: userObject.updatedAt,
    };
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException(
        await this.i18nService.translate('users.EMAIL_ALREADY_EXISTS'),
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      roles: ['user'], // Default role
    });

    const savedUser = await createdUser.save();
    return this.mapUserToDto(savedUser);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel
      .findOne({ email })
      .populate('roles')
      .populate('permissions')
      .exec();
  }

  async findById(id: string): Promise<UserDto> {
    const user = await this.userModel
      .findById(id)
      .populate('roles')
      .populate('permissions')
      .exec();

    if (!user) {
      throw new NotFoundException(
        await this.i18nService.translate('users.USER_NOT_FOUND'),
      );
    }

    return this.mapUserToDto(user);
  }

  async findAll(query: UserQueryDto): Promise<UserListResponseDto> {
    const { page = 1, limit = 10, search } = query;

    const filter = search
      ? {
          $or: [
            { email: { $regex: search, $options: 'i' } },
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .populate('roles')
        .populate('permissions')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      data: users.map((user) => this.mapUserToDto(user)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    // If password is provided, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true })
      .populate('roles')
      .populate('permissions')
      .exec();

    if (!user) {
      throw new NotFoundException(
        await this.i18nService.translate('users.USER_NOT_FOUND'),
      );
    }

    return this.mapUserToDto(user);
  }

  async remove(id: string): Promise<UserDto> {
    const user = await this.userModel
      .findByIdAndDelete(id)
      .populate('roles')
      .populate('permissions')
      .exec();

    if (!user) {
      throw new NotFoundException(
        await this.i18nService.translate('users.USER_NOT_FOUND'),
      );
    }

    return this.mapUserToDto(user);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      {
        refreshToken: refreshToken ? await bcrypt.hash(refreshToken, 10) : null,
        lastLoginAt: new Date(),
      },
    );
  }

  async findByIdWithPassword(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findById(id)
      .select('+password') // Password'ü de getir
      .populate('roles')
      .populate('permissions')
      .exec();

    if (!user) {
      throw new NotFoundException(
        await this.i18nService.translate('users.USER_NOT_FOUND'),
      );
    }

    return user;
  }
}
