import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './DTO/create-task.dto';
import { Task } from './task.entity';
import { TaskValidationPipe } from './Pipes/task-validation.pipe';
import { GetTasksFilterDto } from './DTO/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User) {
    return this.tasksService.getAllTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch('/:id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body(TaskValidationPipe) createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.updateTask(id, createTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }
}
