import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { FilesService } from "src/files/file.service";
import { MongoGridFS } from 'mongo-gridfs'

@Module({
  imports: [],
  providers: [FilesService],
  exports: [FilesService]
})
export class FileModule { }