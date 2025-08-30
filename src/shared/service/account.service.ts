import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model } from 'mongoose';
import { Account } from 'src/module/auth/schemas/account.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
  logger: Logger = new Logger(AccountService.name);
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  async findOne(
    query: FilterQuery<Account>,
  ): Promise<HydratedDocument<Account>> {
    return await this.accountModel.findOne(query).select('+password');
  }

  async getIdAccountByEmail(email: string): Promise<string> {
    const account = await this.accountModel.findOne({ email }).select('_id');
    if (!account) {
      return null;
    }
    return account._id.toString();
  }

  async create(signup: Account): Promise<HydratedDocument<Account>> {
    this.logger.log('Creating user.');

    const hashedPassword = await bcrypt.hash(signup.password, 12);

    const newUser = new this.accountModel(signup);
    newUser.password = hashedPassword;
    return await newUser.save();
  }

  async createNonePasswordAccount(
    account: Account,
  ): Promise<HydratedDocument<Account>> {
    this.logger.log('Creating user without password.');

    const newUser = new this.accountModel(account);
    return newUser.save();
  }

  async validateAccount(
    email: string,
    password: string,
  ): Promise<HydratedDocument<Account> | null> {
    const account = await this.accountModel.findOne({ email });
    if (!account) {
      return Promise.resolve(null);
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);

    if (!isPasswordValid) {
      return Promise.resolve(null);
    }

    return account;
  }

  async createPassword(
    email: string,
    newPassword: string,
  ): Promise<HydratedDocument<Account>> {
    const account = await this.accountModel.findOne({ email });
    if (!account) {
      return Promise.resolve(null);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    account.password = hashedNewPassword;
    account.hasPassword = true; // Ensure hasPassword is set to true
    return await account.save();
  }

  async updatePassword(
    email: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<HydratedDocument<Account>> {
    const account = await this.validateAccount(email, currentPassword);
    if (!account) {
      return Promise.resolve(null);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    account.password = hashedNewPassword;
    account.hasPassword = true; // Ensure hasPassword is set to true
    return await account.save();
  }

  async findOneAndRemove(query: any): Promise<any> {
    this.logger.log('Deleting User.');
    return await this.accountModel.findOneAndDelete(query);
  }
}
