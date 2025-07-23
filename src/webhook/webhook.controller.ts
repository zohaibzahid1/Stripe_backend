import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { WebhookService } from './webhook.service';
import { ConfigService } from '@nestjs/config';

@Controller('webhook')
export class WebhookController {
  private stripe: Stripe;

  constructor(
    private readonly webhookService: WebhookService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-06-30.basil',
    });
  }

  @Post()
  @HttpCode(200)
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response, @Headers('stripe-signature') signature: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    } catch (err) {
      console.error('[Webhook Error]', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Delegate handling to the service
    await this.webhookService.handleEvent(event);

    res.send({ received: true });
  }
}
