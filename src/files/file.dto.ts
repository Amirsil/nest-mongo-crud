import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FileInfo {
    @ApiProperty()
    @Expose()
    length: number;

    @ApiProperty()
    @Expose()
    chunkSize: number;

    @ApiProperty()
    @Expose()
    filename: string;

    @ApiProperty()
    @Expose()
    md5: string;

    @ApiProperty()
    @Expose()
    contentType: string;
    
    id: string;
}

export class FileResponse {
    @ApiProperty() 
    message: string;

    @ApiProperty({ type: FileInfo })
    file: FileInfo;
}



