import { Controller, Get, Post } from '@nestjs/common';

import { MessageBirdService } from './message-bird.service';

@Controller('message')
export class MessageBirdController {
  constructor(private readonly messageBirdService: MessageBirdService) {}

  @Get('test-2')
  async testM() {
    return this.messageBirdService.getBalance();
  }

  @Get('test')
  async test() {
    await this.messageBirdService.sendMessage({
      recipient: '+79777221606',
      message: 'Test message from ICAPIA DEV',
    });
  }
}

// curl -X POST https://rest.messagebird.com/messages \
//         -H 'Authorization: AccessKey AXImf10CklmWeGuDEePS7W25U' \
//         -d "recipients=+994514931149" \
//         -d "originator=ICAPIA" \
//         -d "body=This is test message for verification."
