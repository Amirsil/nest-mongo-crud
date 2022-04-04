import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Cat } from 'src/cat/cat.model';
import { CatService } from 'src/cat/cat.service';
import { FileModule } from 'src/files/file.module';
import { UserController } from './user.controller';
import { User } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [TypegooseModule.forFeature([User]), TypegooseModule.forFeature([Cat]), FileModule],
  controllers: [UserController],
  providers: [UserService, CatService],
})

export class UserModule {}
