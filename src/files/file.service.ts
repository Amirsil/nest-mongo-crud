import { ForbiddenException, Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import * as GridFsStorage from 'multer-gridfs-storage';
import { MongoGridFS, IGridFSObject, IGridFSWriteOption } from 'mongo-gridfs'
import { GridFSBucketReadStream } from 'mongodb'
import { mongoose } from '@typegoose/typegoose';
import { FileInfo } from './file.dto';
import { Readable } from 'stream';

const MONGO_URL = 'mongodb://localhost:27017/nest'

@Injectable()
export class FilesService {
    private fileModel: MongoGridFS;

    constructor() {
        mongoose.connect(MONGO_URL).then((mongoose => {
            this.fileModel = new MongoGridFS(mongoose.connection.db, 'fs')
        }));
    }

    async writeFile(file): Promise<IGridFSObject> {
        this.validateFileIsLegal(file)
        const stream = Readable.from(file.buffer.toString());
        return await this.fileModel.writeFileStream(stream, { filename: 'bro.txt' })
    }


    async readStream(id: string): Promise<GridFSBucketReadStream> {
        return await this.fileModel.readFileStream(id);
    }

    async findInfo(id: string): Promise<IGridFSObject> {
        return await this.fileModel
            .findById(id)
    }

    async deleteFile(id: string): Promise<boolean> {
        return await this.fileModel.delete(id)
    }

    private validateFileIsLegal(file) {
        if (file?.filename?.includes('php')) {
            throw new ForbiddenException('File contents are illegal')
        }
    }
}
