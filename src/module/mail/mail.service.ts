import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';
import { OrderEntity } from '../order-basic/entity/order.entity';
import { OrderDocument } from '../order-basic/schema/order.schema';

@Injectable()
export class MailService {
  private readonly mailConfig = this.configService.get('mail');
  constructor(
    private readonly configService: ConfigService,
  ) { 
    console.log(this.mailConfig);
    
  }

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
    const templatePath = path.join(process.cwd(), 'template', `${templateName}.ejs`);
    return ejs.renderFile(templatePath, data);
  }

  private async sendMail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: `Shop ${this.mailConfig.user}`, // địa chỉ email của bạn
      to,
      subject,
      html,
    });
  }

  async sendOrderReceivedEmail(order: any) {
    try {
      const html = await this.renderTemplate('order-received', order);
      console.log(html);
      
      await this.sendMail(order.customerDetail.email, 'Đơn hàng mới', html);
    } catch (error) {
      console.log(error);
      
    }
  }
}
