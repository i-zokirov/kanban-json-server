import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './schemas/task.schema';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = await this.taskModel.create(createTaskDto);
    return (await createdTask.save()).populate('section');
  }

  findAll() {
    return this.taskModel.find().populate('section');
  }

  findOne(id: string) {
    return this.taskModel.findById(id).populate('section');
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .populate('section');
  }

  remove(id: string) {
    return this.taskModel.findByIdAndDelete(id).populate('section');
  }
}
