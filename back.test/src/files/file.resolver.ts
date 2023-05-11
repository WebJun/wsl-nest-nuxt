import { FilesService } from './file.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
// import { FileUpload } from 'graphql-upload';

@Resolver('files')
export class FileResolver {
  constructor(private readonly fileService: FilesService) {}

  //   @Mutation(() => String)
  //   uploadFile(@Args('files') files: FileUpload) {
  //     return this.fileService.upload();
  //   }
}
