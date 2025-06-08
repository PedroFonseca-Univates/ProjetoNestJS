import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Filme } from './entities/filmes.entity';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { UpdateFilmeDto } from './dto/update-filme.dto';

@Injectable()
export class FilmesService {
  constructor(
    @InjectRepository(Filme)
    private readonly filmeRepository: Repository<Filme>,
  ) {}

  async create(createFilmeDto: CreateFilmeDto): Promise<Filme> {
    try {
      const filme = this.filmeRepository.create(createFilmeDto);
      return await this.filmeRepository.save(filme);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Filme[]> {
    return await this.filmeRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Filme> {
    const filme = await this.filmeRepository.findOne({ where: { id } });
    
    if (!filme) {
      throw new NotFoundException(`Filme com o ID ${id} não encontrado`);
    }
    return filme;
  }

  async update(id: number, updateFilmeDto: UpdateFilmeDto): Promise<Filme> {
    const filme = await this.findOne(id);
    
    try {
      Object.assign(filme, updateFilmeDto);
      return await this.filmeRepository.save(filme);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const filme = await this.findOne(id);
    await this.filmeRepository.remove(filme);
  }

}