import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { UserService } from '../user/user.service';

@Injectable()
export class StripeService {
    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-06-30.basil',
    });

    constructor(private readonly userService: UserService) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('Stripe secret key is not set in environment variables');
        }
    }

    async createStripeCustomer(email: string,name: string, userId: string): Promise<Stripe.Customer> {
        try {
            const customer = await this.stripe.customers.create({
                email,
                name,
                metadata: {
                    userId, // Store user ID in metadata
                },
            });
            return customer;
        } catch (error: any) {
            throw new Error(`Failed to create Stripe customer: ${error.message}`);
        }
    }

    async createOneTimePaymentIntent(amount: number, currency: string, userId: string, type: string): Promise<Stripe.PaymentIntent> {
        try {
            // find the user by ID
            const user = await this.userService.findOne(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Check if the user already has a Stripe customer ID
            if (!user.stripeCustomerId) {
                // If not, create a new Stripe customer
                const customer = await this.createStripeCustomer(
                    user.email,
                    user.name,
                    userId,
                );
                // Update the user with the new Stripe customer ID
                user.stripeCustomerId = customer.id;
                await this.userService.update(user.id, { stripeCustomerId: customer.id });
            }

            // Create a one-time payment intent
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency,
                customer: user.stripeCustomerId,
                metadata: {
                    userId: user.id,
                    type: type, // Store the type of payment in metadata will be used for future reference in webhooks sent by Stripe
                },
            });
            return paymentIntent;
        } catch (error) {
            throw new Error(`Failed to create payment intent: ${error}`);
        }
    }

    async createSubscription(userId: string, priceId: string) {    
        try {
            // Find the user by ID
            const user = await this.userService.findOne(userId);
            if (!user) {
                throw new Error('User not found');
            }
            // Check if the user already has a Stripe customer ID
            if (!user.stripeCustomerId) {
                // If not, create a new Stripe customer
                const customer = await this.createStripeCustomer(
                    user.email,
                    user.name,
                    userId,
                );
                // Update the user with the new Stripe customer ID
                user.stripeCustomerId = customer.id;
                await this.userService.update(user.id, { stripeCustomerId: customer.id });
            }
            const subscription = await this.stripe.subscriptions.create({
                customer: user.stripeCustomerId,
                items: [{ price: priceId }],
                payment_behavior: 'default_incomplete', // Allows for immediate subscription creation
                expand: ['latest_invoice.payment_intent'],
                collection_method: 'charge_automatically', // Automatically charge the customer
            });
            const paymentIntent = (subscription.latest_invoice as any).payment_intent as Stripe.PaymentIntent;            
           //------------- will be handeled by webhook--------
            // // Update the user with subscription details
            // user.stripeSubscriptionId = subscription.id;
            // user.isSubscribed = true;
            // user.subscriptionPlan = priceId; // Store the price ID as the subscription plan
            // user.subscriptionStatus = subscription.status; // Store the subscription status

            // // update the user entity with the new subscription details
            // await this.userService.update(user.id, user);

            return {
                clientSecret: paymentIntent.client_secret,
                subscriptionId: subscription.id,
            };
        } catch (error) {
            throw new Error(`Failed to create subscription: ${error}`);
        }
    }

}
