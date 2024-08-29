import { Controller, Post } from "@nestjs/common";

@Controller("user")
export class UserController {
    @Post()
    async create() { }

    @Post()
    async login() { }
}