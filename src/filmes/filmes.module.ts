import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmesService } from './filmes.service';
import { FilmesController } from './filmes.controller';
import { Filme } from './entities/filmes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Filme])],
  controllers: [FilmesController],
  providers: [FilmesService],
  exports: [FilmesService],
})
export class FilmesModule {}