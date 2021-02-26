import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './DTO/create-task.dto';
import { GetTasksFilterDto } from './DTO/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
@Injectable()
export class TasksService {
  constructor(
    @Inject(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  async getAllTasks(filterDto: GetTasksFilterDto): Promise<Task[]>{
    return await this.taskRepository.getAllTasks(filterDto) 
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException('Task Not Found for given ID');
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async updateTask(id: number, createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);
    const { description, title, status } = createTaskDto;
    task.status = status;
    task.description = description;
    task.title = title;
    await task.save();
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Task Not Found for given ID');
    }
  }
  // without db
  // getSingleTask(id: string): Task {
  //   const dataFound = this.tasks.find((task) => task.id === id);
  //   if (!dataFound) {
  //     throw new NotFoundException("Task Not Found for given ID");
  //   }
  //   return dataFound;
  // }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { description, title, status } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }

  // updateTask(id: string, createTaskDto: CreateTaskDto): Task {
  //   let updateTaskData = this.getSingleTask(id);
  //   updateTaskData = { ...updateTaskData, ...createTaskDto };
  //   this.tasks = this.tasks.map((task) => {
  //     if (task.id === id) return updateTaskData;
  //     else return task;
  //   });
  //   return updateTaskData;
  // }
}
