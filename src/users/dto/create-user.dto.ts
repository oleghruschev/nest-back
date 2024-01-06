import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Email@mail.ru', description: 'Email' })
  readonly email: string;

  @ApiProperty({ example: '1213', description: 'password' })
  readonly password: string;
}
