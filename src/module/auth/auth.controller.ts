import { Body, Controller, HttpCode, HttpStatus, Logger, Post, Req, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { Account, AccountDocument } from './schemas/account.schema';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';

import { AccountService } from 'src/shared/service/account.service';
import { CustomConflictException, CustomInternalServerErrorException, CustomUnauthorizedException } from 'src/shared/exception/custom-exception';
import { LocalAuthGuard } from 'src/shared/guards/auth.guard';
import { FirebaseAuthGuard } from 'src/shared/guards/firebase-auth.guard';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { log } from 'console';

@Controller('auth')
@UsePipes(ValidationPipe)
@UseInterceptors(FormatResponseInterceptor)
export class AuthController {
  logger: Logger = new Logger(AuthController.name);
  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthService
  ) { }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ accessToken: string, refreshToken: string }> {
    try {
      this.logger.log('Creating user.');
      const query = { email: signUpDto.email };
      const isExist = await this.accountService.findOne(query);
      if (isExist) {
        throw new CustomConflictException('Tên đăng nhập đã tồn tại');
      }

      const signUp = new Account(
        signUpDto.email,
        signUpDto.password
      );

      signUp.updatePassword = signUpDto.password;

      const account = await this.accountService.create(signUp);

      const accessToken = this.authService.createAccessToken(account);
      const refreshToken = await this.authService.createRefreshToken(account);
      return { accessToken, refreshToken }
    } catch (error) {
      this.logger.error('Something went wrong in signup:', error);
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string, refreshToken: string }> {
    try {
      this.logger.log('Signing in user.');
      const { email, password } = signInDto;
      const account = await this.accountService.validateAccount(email, password);
      if (!account) {
        throw new CustomUnauthorizedException('Sai tên đăng nhập hoặc mật khẩu');
      }

      const accessToken = this.authService.createAccessToken(account);
      const refreshToken = await this.authService.createRefreshToken(account);

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('Something went wrong in signin:', error);
      throw error;
    }
  }

  @Post('refresh_token')
  async refreshToken(@Body('refreshToken') refreshToken: string): Promise<{ accessToken: string }> {
    try {
      this.logger.log('Refreshing token.');
      const accessToken = await this.authService.verifyRefreshToken(refreshToken);
      return { accessToken }
    } catch (error) {
      this.logger.error('Something went wrong in refreshToken:', error);
      throw error;
    }
  }

  @Post('firebase-authentication')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async firebaseAuth(
    @Req() req: Request
  ) {
    const user: DecodedIdToken = req['user'];
    const email = user.email;
    const name = user.name;
    const avatar = user.picture;
    const provider = user.firebase.sign_in_provider;
    if (provider !== 'google.com' && provider !== 'facebook.com') {
      throw new CustomUnauthorizedException('Chỉ hỗ trợ đăng nhập bằng Google hoặc Facebook');
    }
    try {
      const query = { email };
      let account: AccountDocument = await this.accountService.findOne(query);

      if (!account) {
        this.logger.log('Creating new user from Firebase authentication.');
        const signUp = new Account(email, name, avatar);

        if (provider === 'google.com') {
          signUp.updateFacebookId = user.uid;
        }

        if (provider === 'facebook.com') {
          signUp.updateGoogleId = user.uid;
        }
        account = await this.accountService.createNonePasswordAccount(signUp);
        this.logger.log('New user created:', account);
      } else {
        this.logger.log('User already exists:', account);
        if (provider === 'google.com') {
          if(!account.googleId || account.googleId !== user.uid) {
            this.logger.log('Updating Google ID for existing user.');
            account.updateGoogleId = user.uid;
          }
        }

        if (provider === 'facebook.com') {
          if(!account.facebookId || account.facebookId !== user.uid) {
            this.logger.log('Updating Facebook ID for existing user.');
            account.updateFacebookId = user.uid;
          }
        }
        await account.save();
        this.logger.log('User updated:', account);
      }

      const accessToken = this.authService.createAccessToken(account);
      const refreshToken = await this.authService.createRefreshToken(account);

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('Something went wrong in firebaseAuth:', error);

      throw new CustomInternalServerErrorException('Đăng nhập không thành công');
    }
  }

  @Post('config')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  config() {
    const config = {
      serverTime: Date.now()
    }

    return config;
  }
}