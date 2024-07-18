export interface IUser {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    pictureUrl?: string;
    accessToken: string;
    refreshToken: string;
    refreshTokenInterval: number,
    loginTime: number,
};

export type LoginData = {
    email: string;
    password: string
}  

export type SignupData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }