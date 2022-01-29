export class CreateUserDto {
  username: string;
  email: string;
  saltedPasswordHash: string;
}
