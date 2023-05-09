import { Get, Post, Put, Delete } from '@nestjs/common';
import { Controller, Body, Param, HttpCode } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './article.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Get()
  async index(): Promise<Article[]> {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    return await this.articleService.findAll();
  }
  @Get(':id')
  async show(@Param('id') id: number): Promise<Article> {
    return await this.articleService.findOne(id);
  }
  @Post()
  async store(@Body() article: Article): Promise<Article> {
    console.log(article);
    return await this.articleService.create(article);
  }
  @Put(':id')
  async update(@Param('id') id: number, @Body() article: Article): Promise<Article> {
    return await this.articleService.update(id, article);
  }
  @Delete(':id')
  @HttpCode(204)
  async destroy(@Param('id') id: number) {
    return await this.articleService.destroy(id);
  }
}
