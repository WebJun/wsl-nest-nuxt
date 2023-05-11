import { Module } from '@nestjs/common';
import { FilesService } from './file.service';
import { FileResolver } from './file.resolver';

@Module({
  providers: [FileResolver, FilesService],
})
export class FilesModule {}
