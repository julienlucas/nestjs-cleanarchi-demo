import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags, ApiResponse, ApiExtraModels } from '@nestjs/swagger';
import { GetUser } from '@infrastructure/controllers/auth/get-user.decorator';
import { ApiResponseType } from '@infrastructure/common/swagger/swagger-response.decorator';
import { TasksService } from '@usecases/tasks/tasks.service';
import { CreateTaskDto, GetTasksFilterDto, UpdateTaskStatusDto } from '@infrastructure/controllers/tasks/tasks.dto';
import { Task } from '@domain/entities/task.interface';
import { User } from '@domain/entities/user.interface';

@Controller('tasks')
@ApiTags('Tasks')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(Task)
@UseGuards(AuthGuard())
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  @ApiBody({
    type: GetTasksFilterDto,
    description: 'Json structure for user object',
  })
  @ApiBody({
    type: User,
    description: 'user',
  })
  @ApiResponseType(Task, true)
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  @ApiBody({
    type: User,
    description: 'user',
  })
  @ApiResponseType(Task, true)
  getTaskById(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @ApiBody({
    type: GetTasksFilterDto,
    description: 'Json structure for user object',
  })
  @ApiBody({
    type: User,
    description: 'user',
  })
  @ApiResponseType(Task, true)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  @ApiBody({
    type: User,
    description: 'user',
  })
  @ApiResponseType(Task, true)
  deleteTask(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  @ApiBody({
    type: User,
    description: 'user',
  })
  @ApiResponseType(Task, true)
  updateTaskStatus(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
