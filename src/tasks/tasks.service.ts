import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
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

  async getAllTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getAllTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!found) {
      throw new NotFoundException('Task Not Found for given ID');
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTask(
    id: number,
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    const { description, title, status } = createTaskDto;
    task.status = status;
    task.description = description;
    task.title = title;
    await task.save();
    return task;
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });
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
