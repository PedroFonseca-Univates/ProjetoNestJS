import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FilmesService } from './filmes.service';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { UpdateFilmeDto } from './dto/update-filme.dto';

@Controller('filmes')
export class FilmesController {
  constructor(private readonly filmesService: FilmesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFilmeDto: CreateFilmeDto) {
    return this.filmesService.create(createFilmeDto);
  }

  @Get()
  findAll() {
    return this.filmesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.filmesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFilmeDto: UpdateFilmeDto,
  ) {
    return this.filmesService.update(id, updateFilmeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.filmesService.remove(id);
  }
  
}