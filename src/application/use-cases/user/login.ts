import { Injectable } from '@nestjs/common';
import { AbstractUserRepository } from '../../repositories/userRepository';
import { NotFoundError } from '../../errors/notFound';
import { WrongValueError } from '../../errors/wrongValue';
import { IJwtService } from '../../services/jwt';

interface ILoginUseCaseParams {
  email: string;
  password: string;
}

interface ILoginUseCaseReturn {
  token: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    private userRepository: AbstractUserRepository,
    private jwtService: IJwtService,
  ) {}

  async execute({
    email,
    password,
  }: ILoginUseCaseParams): Promise<ILoginUseCaseReturn> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new NotFoundError('User not found with that email');

    if (!user.password_hash.isTheSameValue(password))
      throw new WrongValueError('Password does not match');

    const { token } = await this.jwtService.generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return { token };
  }
}
