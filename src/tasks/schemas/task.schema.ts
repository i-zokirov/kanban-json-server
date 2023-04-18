import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { Section } from '../../sections/schemas/section.schema'

export type TaskDocument = HydratedDocument<Task>

@Schema()
export class Task {
  @Prop({ required: true })
  title: string
  @Prop()
  description: string

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true,
    onDelete: 'CASCADE'
  })
  section: Section
}

export const TaskSchema = SchemaFactory.createForClass(Task)
