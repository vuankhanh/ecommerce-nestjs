import { AuthenticationProvider, UserRole } from "src/constant/user.constant";

export interface IUser {
  email: string;
  password?: string;
  googleId?: string;
  facebookId?: string;
  name: string;
  avatar?: string;
  role: `${UserRole}`
  createdByProvider: `${AuthenticationProvider}`;
}
