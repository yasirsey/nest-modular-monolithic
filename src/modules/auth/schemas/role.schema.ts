// src/modules/auth/schemas/role.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type RoleDocument = Role & Document<Types.ObjectId> & {
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
      return ret;
    }
  }
})
export class Role {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop([String])
  permissions: string[];

  @Prop()
  description?: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
