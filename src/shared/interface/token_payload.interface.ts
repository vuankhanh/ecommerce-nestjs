import { UserRole } from 'src/constant/user.constant';

export interface ITokenPayload {
  username: string;
  role: `${UserRole}`;
  iat: number;
  exp: number;
}
