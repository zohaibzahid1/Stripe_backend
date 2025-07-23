import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StripeModule } from './stripe/stripe.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [StripeModule, WebhookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
