import { Controller, Delete, Get, Patch, Post } from "@nestjs/common";

@Controller("url")
export class UserController {
    @Post()
    async create() { }

    @Post()
    async redirect() { }

    @Delete()
    async delete() { }

    @Patch()
    async update() { }

    @Get()
    async getUrlsByUserId() { }
}