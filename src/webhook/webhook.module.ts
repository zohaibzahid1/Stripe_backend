import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { UserModule } from 'src/user/user.module';
@Module({
  controllers: [WebhookController],
  providers: [WebhookService,UserModule],
})
export class WebhookModule {}
