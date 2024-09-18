import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(createTaskDto);
    return await this.tasksRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return await this.tasksRepository.find();
  }

  async findOne(id: string): Promise<Task> {
    return await this.tasksRepository.findOne({ where: { id } });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.tasksRepository.update(id, updateTaskDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.tasksRepository.delete(id);
  }

  async getTaskSummary(): Promise<any> {
    const totalTasks = await this.tasksRepository.count();
    const completedTasks = await this.tasksRepository.count({ where: { status: TaskStatus.COMPLETED } });
    const pendingTasks = await this.tasksRepository.count({ where: { status: TaskStatus.PENDING } });
    const inProgressTasks = await this.tasksRepository.count({ where: { status: TaskStatus.IN_PROGRESS } });

    const upcomingTasks = await this.tasksRepository.find({
      where: { 
        status: TaskStatus.PENDING,
        dueDate: MoreThanOrEqual(new Date())
      },
      order: { dueDate: 'ASC' },
      take: 5
    });

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      upcomingTasks
    };
  }
}
