import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { getConfig, getDataSourceConfig } from './common/database/configuration';
import { ArticlesModule } from './articles/articles.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      ignoreEnvFile: false,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => getConfig(),
      dataSourceFactory: async function () {
        return addTransactionalDataSource(new DataSource(getDataSourceConfig()));
      },
    }),
    ArticlesModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
