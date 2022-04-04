import { ApiBody, ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, Max, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCatDTO {
    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(50)
    public name: string;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    public tailLength: number;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false
    })
    public image?: string;

}

export class CatDTO {
    @ApiProperty()
    public name: string;

    @ApiProperty()
    public tailLength: number;
}
