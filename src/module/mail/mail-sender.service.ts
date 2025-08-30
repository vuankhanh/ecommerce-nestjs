import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs/promises';
import { OrderPlainEntity } from '../order-basic/entity/order-plain.entity';

@Injectable()
export class MailSenderService {
  private readonly mailConfig = this.configService.get('mail');
  private readonly shop = this.configService.get('shop');
  private readonly endpoint: string = this.configService.get('endpoint');

  constructor(private readonly configService: ConfigService) {}

  private transporter = nodemailer.createTransport({
    host: this.mailConfig.host, // hoặc SMTP server của bạn
    port: this.mailConfig.port,
    auth: {
      user: this.mailConfig.user, // email của bạn
      pass: this.mailConfig.password, // dùng app password nếu là Gmail
    },
  });

  private async renderTemplate(
    templateName: string,
    data: any,
  ): Promise<string> {
    const frefixStatic = `${this.endpoint}/static`;
    const templateData = Object.assign(
      {},
      data,
      { frefixStatic },
      { shop: this.shop },
    );

    const templatePath = path.join(
      process.cwd(),
      'template',
      `${templateName}.ejs`,
    );
    return ejs.renderFile(templatePath, templateData);
  }

  private async sendMail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: `${this.shop.name} ${this.mailConfig.user}`, // địa chỉ email của bạn
      to,
      subject,
      html,
    });
  }

  async sendTestEmail(to: string) {
    try {
      const templatePath = path.join(
        process.cwd(),
        'template',
        'test-mail.html',
      );
      const html = await fs.readFile(templatePath, 'utf8');
      await this.sendMail(to, 'Email thử nghiệm', html);
    } catch (error) {
      console.error('Error sending test email:');
      console.error(error);
    }
  }

  async sendOrderReceivedEmail(order: OrderPlainEntity) {
    const data = { order };
    try {
      const html = await this.renderTemplate('order-received', data);

      await this.sendMail(
        order.customerEmail,
        `Đơn hàng ${order.orderCode} mới đã được tạo thành công`,
        html,
      );
    } catch (error) {
      console.error('Error sending order received email:');
      console.error(error);
    }
  }

  async sendOrderChangedEmail(
    order: OrderPlainEntity,
    orderChanged: Partial<OrderPlainEntity>,
  ) {
    const data = {
      order,
      orderChanged,
    };
    try {
      const html = await this.renderTemplate('order-changed', data);

      await this.sendMail(
        order.customerEmail,
        `Đơn hàng ${order.orderCode} đã thay đổi`,
        html,
      );
    } catch (error) {
      console.error('Error sending order changed email:');
      console.error(error);
    }
  }

  async sendOrderCancelledEmail(order: OrderPlainEntity) {
    const data = { order };
    try {
      const html = await this.renderTemplate('order-canceled', data);

      await this.sendMail(
        order.customerEmail,
        `Đơn hàng ${order.orderCode} đã hủy`,
        html,
      );
    } catch (error) {
      console.error('Error sending order canceled email:');
      console.error(error);
    }
  }
}
