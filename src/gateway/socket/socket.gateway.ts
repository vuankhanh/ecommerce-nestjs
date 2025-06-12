import { ConfigService } from '@nestjs/config';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CustomLoggerService } from 'src/module/custom_logger/custom_logger.service';
import { IUrl } from 'src/shared/interface/configuration.interface';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer() server: Server;
  constructor(
    private readonly logger: CustomLoggerService, // Assuming you have a custom logger service
    private readonly configService: ConfigService
  ) {}

  afterInit(server: Server) {
    const client: IUrl = this.configService.get<IUrl>('client');
    console.log(client);
    const origin: string = `${client.protocol}://${client.host}:${client.port}`;
    server.engine.opts.cors = {
      origin,
      credentials: true,
    };
    this.logger.log(`Socket CORS set to: ${origin}`);
  }

  handleConnection(client: Socket) {
    this.logger.warn(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.warn(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    this.logger.log(`Message received from ${client.id}: ${JSON.stringify(payload)}`);
    this.server.emit('message', payload);
  }
}
