import { MessageBirdController } from './message-bird.controller';
import { MessageBirdService } from './message-bird.service';
import { Module } from '@nestjs/common';
@Module({
  controllers: [MessageBirdController],
  providers: [MessageBirdService],
})
export class MessageBirdModule {}
