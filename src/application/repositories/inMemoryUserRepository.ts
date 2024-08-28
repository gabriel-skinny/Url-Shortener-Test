import { User } from "../entities/User";
import { IUserRepository } from "./userRepository";

export class InMemoryUserRepository implements IUserRepository {
    public userDatabase: User[] = [];

    async save(user: User): Promise<void> {
        this.userDatabase.push(user);
    }

    async existsByEmail(email: string): Promise<boolean> {
        console.log({ database: this.userDatabase, result: !!this.userDatabase.find(user => user.email == email) })
        return !!this.userDatabase.find(user => user.email == email);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userDatabase.find(user => user.email == email);
    }

}