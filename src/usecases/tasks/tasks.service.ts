import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from '@domain/enums/task-status.enum';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';
import { TasksRepository } from '@infrastructure/repositories/tasks.repository';
import { CreateTaskDto, GetTasksFilterDto } from '@infrastructure/controllers/tasks/tasks.dto';
import { Task } from '@domain/entities/task.interface';
import { User } from '@domain/entities/user.interface';

@Injectable()
export class TasksService {
  constructor(
    private readonly logger: LoggerService,
    private readonly exception: ExceptionsService,

    @InjectRepository(TasksRepository)
    private readonly tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterDto:  GetTasksFilterDto, user: User): Promise<Task[]> {
    const result = await this.tasksRepository.getTasks(filterDto, user);

    this.logger.verbose('tasksUsecases execute', `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
    return result;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, user } });

    if (!found) {
      const message = `Task with ID "${id}" not found.`;

      this.logger.error(message, 'Code_error: 404');
      throw this.exception.NotFoundException({ message, code_error: 404 });
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const result = await this.tasksRepository.createTask(createTaskDto, user);

    this.logger.verbose('tasksUsecases execute', `User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`);
    return result;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    if(result.affected === 0) {
      const message = `Task with ID "${id}" not found.`;

      this.logger.error(message, 'Code_error: 404');
      throw this.exception.NotFoundException({ message, code_error: 404 });
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    return this.tasksRepository.save({ id, status });
  }
}
