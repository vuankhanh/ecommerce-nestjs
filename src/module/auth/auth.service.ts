import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account, AccountDocument } from './schemas/account.schema';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { RefreshTokenService } from 'src/shared/service/refresh_token.service';
import { AccountService } from 'src/shared/service/account.service';
import { CustomForbiddenException, CustomUnauthorizedException } from 'src/shared/core/exception/custom-exception';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly jwtAccessToken = this.configService.get('jwt.accessToken');
  private readonly jwtRefreshToken = this.configService.get('jwt.refreshToken');
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
    private accountService: AccountService,
  ) { }

  createAccessToken(account: HydratedDocument<Account>): string {
    const { email, name, avatar, role } = account;
    const payload = { email, name, avatar, role };

    const token = this.jwtService.sign(payload, {
      secret: this.jwtAccessToken.secret,
      expiresIn: this.jwtAccessToken.expiresIn
    });

    return token;
  }

  async createRefreshToken(account: HydratedDocument<Account>): Promise<string> {
    const { email, name, avatar, role } = account;
    const payload = { email, name, avatar, role };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtRefreshToken.secret,
      expiresIn: this.jwtRefreshToken.expiresIn
    });

    const refreshTokenLife: number = parseInt(this.jwtRefreshToken.expiresIn);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + refreshTokenLife);

    const accountId: Types.ObjectId = account._id;
    await this.refreshTokenService.findOneAndRemove(accountId);
    await this.refreshTokenService.create(accountId, refreshToken, expiresAt);

    return refreshToken;
  }

  verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.jwtAccessToken.secret
      });
      return decoded;
    } catch (error) {
      throw new CustomUnauthorizedException('Token không hợp lệ');
    }
  }

  async verifyRefreshToken(refreshToken: string): Promise<string> {
    try {
      const decode = this.jwtService.decode(refreshToken);
      const username = decode['username'];
      const account = await this.accountService.findOne({ username });
      const accountId: string = account._id.toString();

      const refreshTokenDoc = await this.refreshTokenService.findOne(accountId, refreshToken);
      if (!refreshTokenDoc) {
        throw new CustomForbiddenException('Không tìm thấy refresh token');
      }
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.jwtRefreshToken.secret,
      });

      return this.createAccessToken(account);
    } catch (error) {
      throw new CustomForbiddenException('Invalid refresh token');
    }
  }
}
