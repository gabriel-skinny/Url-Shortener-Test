import { IUserExistsByIdUseCase } from 'src/application/use-cases/user/exists-by-id';

export default class UserExistsByIdUseCaseStub
  implements IUserExistsByIdUseCase
{
  async execute(userId: string): Promise<boolean> {
    return true;
  }
}
