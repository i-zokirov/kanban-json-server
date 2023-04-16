import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type SectionDocument = HydratedDocument<Section>;

@Schema()
export class Section {
  @Prop({ required: true })
  title: string;
}
export const SectionSchema = SchemaFactory.createForClass(Section);
