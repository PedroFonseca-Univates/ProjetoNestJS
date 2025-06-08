import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FilmesModule } from './filmes/filmes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'banco.db', // Arquivo do banco SQLite
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Apenas para desenvolvimento
    }),
    FilmesModule,
  ],
})
export class AppModule {}