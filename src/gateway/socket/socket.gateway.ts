import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CustomLoggerService } from 'src/module/custom_logger/custom_logger.service';

@WebSocketGateway({
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:4200',
        'https://localhost:4200',
        'http://localhost:4000',
        'https://localhost:4000',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  },
})
export class SocketGateway {
  @WebSocketServer() server: Server;
  constructor(
    private readonly logger: CustomLoggerService, // Assuming you have a custom logger service
  ) {}

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
