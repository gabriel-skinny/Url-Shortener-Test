import { IUserRepository } from "src/application/repositories/userRepository";

export interface IUserExistsByIdUseCase {
    execute(userId: string): Promise<boolean>
}

export class UserExistsByIdUseCase implements IUserExistsByIdUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(userId: string): Promise<boolean> {
        return this.userRepository.existsById(userId);
    }
}