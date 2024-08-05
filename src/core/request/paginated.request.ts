import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ParseToInteger } from 'core/decorators';

export enum OrderDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

export default class PaginatedRequest {
    @ApiPropertyOptional()
    @IsOptional()
    @ParseToInteger()
    @IsInt()
    page: number;

    @ApiPropertyOptional()
    @IsOptional()
    @ParseToInteger()
    @IsInt()
    limit: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    column: string;

    @ApiPropertyOptional({ enum: OrderDirection })
    @IsOptional()
    @IsEnum(OrderDirection)
    direction: OrderDirection;
}
