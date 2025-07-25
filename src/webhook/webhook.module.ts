import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, ConfigModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})

export class WebhookModule {}
