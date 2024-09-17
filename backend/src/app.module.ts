import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://localhost:27017/taskmanagement',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      entities: [Task],
      synchronize: true, // Not recommended for production
    }),
    TasksModule,
  ],
})
export class AppModule {}