import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'tester@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'test@2025#' })
  @IsString()
  password: string;
}
