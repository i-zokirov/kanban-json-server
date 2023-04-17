import { Module, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { Section, SectionSchema } from './schemas/section.schema';
import { SectionMiddleware } from './sections.middleware';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Section.name,
        schema: SectionSchema,
      },
    ]),
    TasksModule,
  ],
  controllers: [SectionsController],
  providers: [SectionsService],
})
export class SectionsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SectionMiddleware).forRoutes('sections/:sectionId');
  }
}
