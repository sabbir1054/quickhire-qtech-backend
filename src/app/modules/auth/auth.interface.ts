export type IUser = {
  name: string;
  email: string;
  password: string;
};
export type IUserLogin = {
  email: string;
  password: string;
};
export type IRefreshTokenResponse = {
  accessToken: string;
};
export type IPasswordChange = {
  oldPassword: string;
  newPassword: string;
};
