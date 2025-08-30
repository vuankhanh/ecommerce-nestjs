import { exec } from 'child_process';

let isHandlingRedisError = false;

export function handleBullQueueError(err: Error) {
  if (isHandlingRedisError) return;
  isHandlingRedisError = true;

  if (err.message && err.message.includes('ECONNREFUSED')) {
    console.error('Bull queue error:', err);
    exec('docker start redis', (error, stdout, stderr) => {
      if (error) {
        console.error(`Không thể khởi động redis: ${error.message}`);
      } else if (stderr) {
        console.error(`Lỗi khi khởi động redis: ${stderr}`);
      } else {
        console.log(`Đã khởi động lại redis: ${stdout}`);
      }
      isHandlingRedisError = false;
    });
  } else {
    isHandlingRedisError = false;
  }
}
