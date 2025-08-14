import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';
import { Order, OrderDocument } from '../order-basic/schema/order.schema';
import { IUrl } from 'src/shared/interface/configuration.interface';
import { IOrderPopulated } from 'src/shared/interface/order-response.interface';

@Injectable()
export class MailSenderService {
  private readonly mailConfig = this.configService.get('mail');
  private readonly shop = this.configService.get('shop');
  private readonly app: IUrl = this.configService.get('app');

  constructor(
    private readonly configService: ConfigService,
  ) { }

  private transporter = nodemailer.createTransport({
    host: this.mailConfig.host, // hoặc SMTP server của bạn
    port: this.mailConfig.port,
    secure: true,
    auth: {
      user: this.mailConfig.user, // email của bạn
      pass: this.mailConfig.password, // dùng app password nếu là Gmail
    },
  });

  private async renderTemplate(templateName: string, data: any): Promise<string> {
    const frefixStatic = `${this.app.protocol}://${this.app.host}:${this.app.port}/static`;
    const templateData = Object.assign({}, data, { frefixStatic }, { shop: this.shop });

    const templatePath = path.join(process.cwd(), 'template', `${templateName}.ejs`);
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

  async sendOrderReceivedEmail(order: OrderDocument) {
    const data = { order };
    const html = await this.renderTemplate('order-received', data);

    await this.sendMail(order.customerDetail.email, `Đơn hàng ${order.orderCode} mới đã được tạo thành công`, html);
  }

  async sendOrderChangedEmail(order: IOrderPopulated, orderChanged: Partial<Order>) {
    const data = {
      order,
      orderChanged
    };
    const html = await this.renderTemplate('order-changed', data);

    await this.sendMail(order.customerDetail.email, `Đơn hàng ${order.orderCode} đã thay đổi`, html);
  }

  async sendOrderCancelledEmail(order: IOrderPopulated) {
    const data = { order };
    const html = await this.renderTemplate('order-canceled', data);

    await this.sendMail(order.customerDetail.email, `Đơn hàng ${order.orderCode} đã hủy`, html);
  }
}
