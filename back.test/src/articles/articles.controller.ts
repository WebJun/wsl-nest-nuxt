import { Get, Post, Put, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { Controller, Body, Param, HttpCode } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './article.entity';
import { AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from '../files/file.service';

interface PaginationParams {
  page: number;
  limit: number;
  sort: string;
}

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Get()
  async index(@Query() params: PaginationParams): Promise<any> {
    let { page, limit, sort } = params;
    limit = Number(limit);
    let articles = await this.articleService.lists(params);

    articles.items = articles.items.map((e) => {
      let qqq = e.images as any[];
      for (let i = 0; i < qqq.length; i++) {
        e.images[i] = `http://back.test${qqq[i]}`;
      }
      return e;
    });
    return articles;
  }

  @Get(':id')
  async show(@Param('id') id: number): Promise<Article> {
    return await this.articleService.findOne(id);
  }
  @Post()
  //   @UseInterceptors(FilesInterceptor('images[]'))
  @UseInterceptors(AnyFilesInterceptor())
  async store(@Body() article: Article, @UploadedFiles() files): Promise<Article> {
    // 외부서버로 이미지 파일 보내고 주소 받기
    let fileService = new FileService();
    let filePaths = fileService.uploadFile(files);
    article.images = filePaths.map((e) => {
      return e.filePath;
    });

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
