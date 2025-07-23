import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeResolver } from './stripe.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [StripeResolver, StripeService],
  imports: [UserModule],
})
export class StripeModule {}
