import { Get, Post, Put, Delete, Query } from '@nestjs/common';
import { Controller, Body, Param, HttpCode } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './article.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Get()
  async index(@Query('page') currentPage: number, @Query('limit') limit: number): Promise<any> {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    currentPage = Number(currentPage);
    limit = Number(limit);
    const morePage = 2;
    const items = await this.articleService.findAll(currentPage, limit);
    const totalCount = await this.articleService.count();
    const pageCount = Math.ceil(totalCount / limit);
    currentPage = currentPage < 1 ? 1 : currentPage;
    currentPage = currentPage > pageCount ? pageCount : currentPage;
    const start = Math.max(currentPage - morePage, 1);
    const end = Math.min(currentPage + morePage, pageCount);
    const previous = Math.max(start - morePage, 1);
    const next = Math.min(end + morePage, pageCount);
    return {
      items: items,
      pagination: {
        totalCount,
        pageCount,
        currentPage,
        start,
        end,
        previous,
        next,
      },
    };
  }
  //   private function pages(array $requ): array
  //   {
  //       $more_page = 2;
  //       $result = [];
  //       $result['tot_cnt'] = Score::where(['season' => 'Season ' . $requ['season'], 'area' => $requ['area']])->count();
  //       $result['c'] = intval($requ['page']); //현재페이지
  //       $result['cnt'] = CEIL($result['tot_cnt'] / $this->limit_size); //페이지의 총 수
  //       if ($result['c'] < 1) $result['c'] = 1; //가장 작은 페이지 : 1
  //       if ($result['c'] > $result['cnt']) $result['c'] = $result['cnt']; //가장 큰 페이지 : 페이지수
  //       $result['s'] = max($result['c'] - $more_page, 1); //블럭의 시작페이지번호
  //       $result['e'] = min($result['c'] + $more_page, $result['cnt']); //블럭의 마지막페이지번호
  //       $result['p'] = max($result['s'] - $more_page - 1, 1); //현재 페이지 -1
  //       $result['n'] = min($result['e'] + $more_page + 1, $result['cnt']); //현재 페이지 +1
  //       return $result;
  //   }
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
