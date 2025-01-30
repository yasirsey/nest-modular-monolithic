import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// src/modules/auth/schemas/permission.schema.ts
export type PermissionDocument = Permission & Document;
@Schema()
export class Permission {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: [String] })
  allowedActions?: string[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
