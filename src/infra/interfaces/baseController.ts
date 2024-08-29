import { HttpStatus } from "@nestjs/common";

export interface BaseControllerReturn<T = void> {
    data?: T;
    message: string;
    statusCode: HttpStatus;
}