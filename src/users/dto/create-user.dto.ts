import { IsEmail, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(120)
  age?: number;

  @IsOptional()
  isActive?: boolean;
}