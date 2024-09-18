import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity/task.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URI,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      entities: [Task],
      synchronize: true, // Not recommended for production
    }),
    TasksModule,
  ],
})
export class AppModule {}