import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, accountSchema } from './schemas/account.schema';
import { JwtModule } from '@nestjs/jwt';
import { LocalAuthGuard } from '../../shared/core/guards/auth.guard';
import { RefreshToken, refreshTokenSchema } from './schemas/refresh_token.schema';
import { AccountService } from 'src/shared/service/account.service';
import { RefreshTokenService } from 'src/shared/service/refresh_token.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseAuthGuard } from 'src/shared/core/guards/firebase-auth.guard';
@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: accountSchema,
        collection: Account.name.toLowerCase()
      },
      {
        name: RefreshToken.name,
        schema: refreshTokenSchema,
        collection: RefreshToken.name.toLowerCase()
      }
    ]),
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccountService,
    RefreshTokenService,
    LocalAuthGuard,
    FirebaseAuthGuard
  ]
})
export class AuthModule { }
