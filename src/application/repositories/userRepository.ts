import { User } from "../entities/User";

export interface IUserRepository {
    save(user: User): Promise<void>;
    existsByEmail(email: string): Promise<boolean>;
    findByEmail(email: string): Promise<User | null>
}