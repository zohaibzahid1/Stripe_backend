import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StripeModule } from './stripe/stripe.module';
import { WebhookModule } from './webhook/webhook.module';
import { AuthenticationModule } from './authentication/auth.module';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DateTimeResolver } from 'graphql-scalars';
@Module({
  imports: 
  [
    ConfigModule.forRoot(),
    AuthenticationModule,
    UserModule,
    StripeModule,
     WebhookModule,
     GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      playground: true,
      introspection: true,
      resolvers: {
        DateTime: DateTimeResolver,
      },
      context: ({ req, res }) => {
         return { req, res };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres' ,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: String(process.env.DB_PASS),

      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity.{ts,js}'], // Path to your entity files
      migrations: [__dirname + '/../migrations/*.{ts,js}'], // Path to your migration files
      synchronize: true, // ❌ Do not use in production because we use migrations
      autoLoadEntities: true, 
      migrationsTableName: 'migrations', // where all migrations are stored
    }),
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
