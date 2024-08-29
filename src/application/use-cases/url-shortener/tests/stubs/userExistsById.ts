import { AbstractUserExistsByIdUseCase } from 'src/application/use-cases/user/exists-by-id';

export default class UserExistsByIdUseCaseStub
  implements AbstractUserExistsByIdUseCase
{
  async execute(userId: string): Promise<boolean> {
    return true;
  }
}
