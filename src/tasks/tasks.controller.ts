import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './DTO/create-task.dto';
import { Task } from './task.entity';
import { TaskValidationPipe } from './Pipes/task-validation.pipe';
import { GetTasksFilterDto } from './DTO/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto) {
    return this.tasksService.getAllTasks(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id')
  updateTask(@Param('id', ParseIntPipe) id: number, @Body(TaskValidationPipe) createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.updateTask(id, createTaskDto)
  }

  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.deleteTask(id)
  }
}
