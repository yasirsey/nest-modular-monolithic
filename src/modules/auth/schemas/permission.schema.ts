// src/modules/auth/schemas/permission.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PermissionDocument = Permission & Document<Types.ObjectId> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Permission {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: [String] })
  allowedActions?: string[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);