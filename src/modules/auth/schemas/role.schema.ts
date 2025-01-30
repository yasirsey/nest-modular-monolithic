import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// src/modules/auth/schemas/role.schema.ts

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop([String])
  permissions: string[];

  @Prop()
  description?: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.set('toObject', { virtuals: true });
RoleSchema.set('toJSON', { virtuals: true });