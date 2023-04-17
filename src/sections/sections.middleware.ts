import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TasksService } from 'src/tasks/tasks.service';
import { SectionsService } from './sections.service';

@Injectable()
export class SectionMiddleware implements NestMiddleware {
  constructor(
    private readonly tasksService: TasksService,
    private readonly sectionService: SectionsService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'DELETE') {
      const sectionId = req.params.sectionId;
      // Find the section and delete its related tasks
      const section = await this.sectionService.findOne(sectionId);
      if (section) {
        const result = await this.tasksService.deleteMany({
          section: section._id,
        });
        console.log(`Deleted ${result.deletedCount} tasks`);
      }
    }
    // Call the next middleware/controller
    next();
  }
}
