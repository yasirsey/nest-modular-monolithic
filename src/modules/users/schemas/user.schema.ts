import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from 'src/modules/auth/schemas/role.schema';
import { Permission } from 'src/modules/auth/schemas/permission.schema';

export type UserDocument = User &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id?.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  id?: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    type: {
      countryCode: { type: String, required: true }, // Ex: "+90"
      number: { type: String, required: true }, // Ex: "5321234567"
    },
    _id: false,
  })
  phone?: {
    countryCode: string;
    number: string;
  };

  @Prop()
  password?: string;

  @Prop({ default: 'local' })
  provider: string;

  @Prop()
  providerId?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: Role.name }], default: ['user'] })
  roles: Role[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: Permission.name }],
    default: ['read:profile'],
  })
  permissions: Permission[];

  @Prop()
  refreshToken?: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ type: Date })
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
