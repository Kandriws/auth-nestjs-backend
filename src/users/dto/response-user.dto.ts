export class ResponseUserDto {
  id: string;
  name: string;
  email: string;
  otp?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
