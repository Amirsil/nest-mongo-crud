import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { Cat } from "./cat.model";
import { CatController } from "./cat.controller";
import { CatService } from "./cat.service";
import { FilesService } from "src/files/file.service";
import { MongoGridFS } from 'mongo-gridfs'
import { FileModule } from "src/files/file.module";
@Module({
  imports: [TypegooseModule.forFeature([Cat]), FileModule],
  controllers: [CatController],
  providers: [CatService, FilesService],
  exports: [CatService]
})
export class CatsModule { }