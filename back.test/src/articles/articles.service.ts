import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private usersRepository: Repository<Article>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<Article[]> {
    const skip = (page - 1) * limit;
    return this.usersRepository.find({
      skip: skip,
      take: limit,
      order: {
        id: 'DESC',
      },
    });
  }
  async count(): Promise<number> {
    return this.usersRepository.count();
  }
  async findOne(id: number): Promise<Article | null> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return user;
  }

  async create(user: Article): Promise<Article> {
    return await this.usersRepository.save(user);
  }

  async update(id: number, request: Article): Promise<Article> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    user.title = request.title;
    user.content = request.content;
    return await this.usersRepository.save(user);
  }

  async destroy(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
