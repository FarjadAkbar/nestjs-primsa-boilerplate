import { ApiProperty } from '@nestjs/swagger';
import { UserResponseModel } from './model';

export class AppResponse<T> {
    // @ApiProperty()
    // message:string;
    @ApiProperty()
    data: T;
}

export class ResponseHelper {
    public static ok<T>(data:T) : AppResponse<T> {
        return {data};
    }
}
