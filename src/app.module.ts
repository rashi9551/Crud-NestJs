import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService } from './utils/email/email.service';
import { EmailModule } from './utils/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost/nest'),
    EmailModule,
  ],
  providers: [EmailService],
})
export class AppModule {}
