import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CreateUserUseCase } from 'src/application/use-cases/user/create';
import { LoginUseCase } from 'src/application/use-cases/user/login';
import { BaseControllerReturn } from 'src/infra/interfaces/baseController';
import { CreateUserDTO, LoginDTO } from '../dto/user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User routes')
@Controller('user')
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private loginUseCase: LoginUseCase,
  ) {}

  @Post()
  async create(
    @Body() { email, name, password }: CreateUserDTO,
  ): Promise<BaseControllerReturn> {
    await this.createUserUseCase.execute({
      email,
      name,
      password,
    });

    return {
      message: 'User created succesfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Post('/login')
  async login(
    @Body() { email, password }: LoginDTO,
  ): Promise<BaseControllerReturn<{ token: string }>> {
    const { token } = await this.loginUseCase.execute({
      email,
      password,
    });

    return {
      message: 'loged in succesfully',
      statusCode: HttpStatus.OK,
      data: { token },
    };
  }
}
