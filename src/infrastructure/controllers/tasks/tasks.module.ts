import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from '@infrastructure/controllers/tasks/tasks.controller';
import { TasksRepository } from '@infrastructure/repositories/tasks.repository';
import { TasksService } from '@usecases/tasks/tasks.service';
import { Task } from '@domain/entities/task.interface';
import { AuthModule } from '@infrastructure/controllers/auth/auth.module';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { ExceptionsService } from '@/infrastructure/exceptions/exceptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    AuthModule
  ],
  controllers: [TasksController],
  providers: [LoggerService, ExceptionsService, TasksService, TasksRepository]
})
export class TasksModule {}