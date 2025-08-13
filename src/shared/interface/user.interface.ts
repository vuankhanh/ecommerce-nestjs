import { AuthenticationProvider, UserRole } from "src/constant/user.constant";

export interface IUser {
  email: string;
  password?: string;
  googleId?: string;
  facebookId?: string;
  hasPassword?: boolean;
  name: string;
  avatar?: string;
  role: `${UserRole}`
  createdByProvider: `${AuthenticationProvider}`;
}

export interface IAcctountResponse extends IUser {

}