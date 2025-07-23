import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
@Injectable()
export class WebhookService {
    constructor(private readonly userService: UserService) {
        // Initialize any dependencies if needed
    }
    
  async handleEvent(event: any): Promise<void> {
    switch (event.type) {
      /**
       * -----------------------------
       * 🎯 ONE-TIME PAYMENT EVENTS
       * -----------------------------
       */

      case 'payment_intent.succeeded':
        // Handle successful one-time payment
        console.log('✅ PaymentIntent succeeded (one-time payment)');
        this.handleOneTimePayment(event.data.object,true);
        break;
        
      case 'payment_intent.payment_failed':
        // Handle failed one-time payment
        console.log('❌ PaymentIntent failed (one-time payment)');
        this.handleOneTimePayment(event.data.object,false);
        break;
      
        /**
       * -----------------------------
       * 🔁 SUBSCRIPTION INVOICE EVENTS
       * -----------------------------
       */

      case 'invoice.paid':
        // Handle successful invoice payment (first or recurring)
        console.log('✅ Invoice paid (subscription payment)');
        this.handleInvoicePaid(event.data.object);
        break;

      case 'invoice.payment_failed':
        // Handle failed subscription payment
        this.handleInvoicePaymentFailed(event.data.object);
        console.log('❌ Invoice payment failed (subscription)');

        break;

      /**
       * -----------------------------
       * 🔄 SUBSCRIPTION STATUS EVENTS
       * -----------------------------
       */

      case 'customer.subscription.created':
        // A new subscription was created
        console.log('📦 Subscription created');
        this.handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        // Subscription was updated (e.g., upgrade/downgrade)
        console.log('🔁 Subscription updated');
        this.handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        // Subscription was canceled or expired
        console.log('🚫 Subscription canceled or deleted');
        this.handleSubscriptionDeleted(event.data.object);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }
  }
    // Handlers for different event types
    // These methods can be customized to perform specific actions based on the event type
    private handleOneTimePayment(paymentIntent: any, result: boolean): void {
        // Logic to handle successful one-time payment;
        const userId = paymentIntent.metadata.userId; // Access user ID from metadata
        try {
            if (result){
            this.userService.updateOneTimePaymentStatus(userId, true); // Update user's hasOneTimePaid status
            console.log(`User ${userId} has successfully made a one-time payment.`);
            }
            else {
            this.userService.updateOneTimePaymentStatus(userId, false); // Update user's hasOneTimePaid status
            console.log(`User ${userId} has failed to make a one-time payment.`);
            }
        } catch (error) {
            console.error('Error updating one-time payment status:', error);
        }
    }
    private handleSubscriptionCreated(subscription: any): void {

        // Logic to handle new subscription creation
        const userId = subscription.metadata.userId; // Access user ID from metadata
        try {
            this.userService.update(userId, {
                stripeSubscriptionId: subscription.id,
                isSubscribed: true,
                subscriptionPlan: subscription.items.data[0].price.id,
                subscriptionStatus: subscription.status, // status will be incomplete until the first payment is made
            });
            console.log(`User ${userId} has created a new subscription.`);
        } catch (error) {
            console.error('Error updating subscription details:', error);
        }
    }
    private handleSubscriptionDeleted(subscription: any): void {
        // Logic to handle subscription cancellation or deletion
        const userId = subscription.metadata.userId; // Access user ID from metadata
        try {
            this.userService.update(userId, {
                stripeSubscriptionId: null,
                isSubscribed: false,
                subscriptionPlan: null,
                subscriptionStatus: 'canceled',
            });
            console.log(`User ${userId} has canceled their subscription.`);
        } catch (error) {
            console.error('Error updating subscription cancellation:', error);
        }
    }
    private handleSubscriptionUpdated(subscription: any): void {
        // Logic to handle subscription updates (e.g., plan changes)
        const userId = subscription.metadata.userId; // Access user ID from metadata
        try {
            this.userService.update(userId, {
                stripeSubscriptionId: subscription.id,
                isSubscribed: true,
                subscriptionPlan: subscription.items.data[0].price.id,
                subscriptionStatus: subscription.status,
            });
            console.log(`User ${userId} has updated their subscription.`);
        } catch (error) {
            console.error('Error updating subscription details:', error);
        }
    }
    private handleInvoicePaid(invoice: any): void {
        // Logic to handle successful invoice payment
        const userId = invoice.metadata.userId; // Access user ID from metadata
        try {
            this.userService.update(userId, {
                isSubscribed: true,
                subscriptionStatus: invoice.status,
                currentPeriodEnd: new Date(invoice.lines.data[0].period.end * 1000), // Use correct path for period_end
            });
            console.log(`User ${userId} has successfully paid their subscription invoice.`);
        } catch (error) {
            console.error('Error updating subscription payment status:', error);
        }
    }
    private handleInvoicePaymentFailed(invoice: any): void {
        // Logic to handle failed invoice payment
        const userId = invoice.metadata.userId; // Access user ID from metadata
        try {
            this.userService.update(userId, {
                isSubscribed: false,
                subscriptionStatus: 'past_due',
            });
            console.log(`User ${userId} has failed to pay their subscription invoice.`);
        } catch (error) {
            console.error('Error updating subscription payment failure:', error);
        }
    }

}
