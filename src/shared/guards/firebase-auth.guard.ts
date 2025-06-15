import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CustomUnauthorizedException } from '../exception/custom-exception';
import adminFirebase from '.././../firebase/firebase.service';
@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;
    if (!body || !body.idToken) {
      throw new CustomUnauthorizedException('Không có idToken trong body');
    }

    const idToken = body.idToken;
    const email = body.email;
    try {
      // Xác thực token với Firebase Admin SDK
      const decodedToken = await adminFirebase.auth().verifyIdToken(idToken);
      if (decodedToken.firebase.sign_in_provider === 'facebook.com') {
        if (!email || email.trim() === '') {
          throw new CustomUnauthorizedException('Email không được để trống khi đăng nhập bằng Facebook');
        }
        decodedToken.email = email; 
      }
      request['user'] = decodedToken; // Lưu thông tin user vào request
    } catch (error) {
      throw new CustomUnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
    return true;
  }
}
