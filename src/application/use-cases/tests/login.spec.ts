import { InMemoryUserRepository } from "../../../application/repositories/inMemoryUserRepository";
import { CreateUserUseCase } from "../create-user"
import { makeUser } from "./factories/makeUser";
import { AlreadyCreatedError } from "../../../application/errors/alreadyCreated";
import { LoginUseCase } from "../login";
import { JwtMock } from "src/application/services/jwtMock";
import { Password } from "src/application/entities/Password";
import { NotFoundError } from "src/application/errors/notFound";
import { WrongValueError } from "src/application/errors/wrongValue";


const makeSut = () => {
    const userRepository = new InMemoryUserRepository();
    const jwtService = new JwtMock();
    const loginUseCase = new LoginUseCase(userRepository, jwtService);

    return { userRepository, loginUseCase, jwtService }
}

describe("Login user use case", () => {
    it("A user should login with the rigth credentials", async () => {
        const { userRepository, loginUseCase } = makeSut();

        const plainPassword = "plainPassword"
        const userRegistred = makeUser({ password: plainPassword });
        await userRepository.save(userRegistred);

        const response = await loginUseCase.execute({
            email: userRegistred.email,
            password: plainPassword
        });

        expect(response.token).toBeTruthy();
    });

    it("Should throw an NotFoundError if a user does not exists with that email", async () => {
        const { loginUseCase } = makeSut();

        const loginUseCasePromise = loginUseCase.execute({
            email: "nonExistingEmail@gmail.com",
            password: "password"
        });

        expect(loginUseCasePromise).rejects.toStrictEqual(new NotFoundError("User not found with that email"));
    });

    it("Should throw an error with user tries to login with the wrong password", async () => {
        const { userRepository, loginUseCase } = makeSut();

        const plainPassword = "plainPassword"
        const userRegistred = makeUser({ password: plainPassword });
        await userRepository.save(userRegistred);

        const loginUseCasePromise = loginUseCase.execute({
            email: userRegistred.email,
            password: "wrongPassword"
        });

        expect(loginUseCasePromise).rejects.toStrictEqual(new WrongValueError("Password does not match"));
    });
})