import { Context, Mutation, Resolver,Args } from '@nestjs/graphql';
import { StripeService } from './stripe.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt-auth.gurad';

@Resolver('Stripe')
export class StripeResolver {
  constructor(private readonly stripeService: StripeService) {}

  // Mutation to create a one-time payment intent
  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async createOneTimePaymentIntent(@Context() context : any ): Promise<string> {
    const userId = context.req.user.userId; // Get user ID from the request context

    const amount = Number(process.env.ONE_TIME_PAYMENT_AMOUNT); // Amount to be charged
    const currency = process.env.ONE_TIME_PAYMENT_CURRENCY;// Currency for the payment
    const type = process.env.ONE_TIME_PAYMENT_TYPE; // Type of payment

    if (!amount || !currency || !type) {
      throw new Error('Payment amount or currency or type is not set in environment variables');
    }

    // call the service to create a one-time payment intent
    const paymentIntent = await this.stripeService.createOneTimePaymentIntent(
      amount, 
      currency,
      userId,
      type
    );
    return paymentIntent.client_secret!; // Return the client secret for the payment intent
  }

  @Mutation()
  @UseGuards(JwtGuard)
  async createSubscription(@Context() context: any, @Args('priceId') priceId: string) 
  {
    const userId = context.req.user.userId; // Get user ID from the request context

    if (!priceId) {
      throw new Error('Price ID is required to create a subscription');
    }

    // Call the service to create a subscription
    const {clientSecret,subscriptionId} = await this.stripeService.createSubscription(userId, priceId);

    return {
      clientSecret, // Return the client secret for the subscription
      subscriptionId // Return the subscription ID
    } 
  }
}