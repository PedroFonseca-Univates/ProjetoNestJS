import { IsEmail, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateFilmeDto {
  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  descricao: string;

  @IsNotEmpty()
  genero: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  duracao: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1900)
  anolancamento: number;
  
}