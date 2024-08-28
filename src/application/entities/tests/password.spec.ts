import { Password } from "../Password";

describe("Password entity", () => {
    it("Should create a password with a hashed value", () => {
        const plainPassword = "password"
        const password = new Password(plainPassword);

        expect(password).toBeTruthy();
        expect(password.value).not.toBe(plainPassword);
    });

    it("Should return true if the password passed has the same value as the saved one", () => {
        const plainPassword = "password";
        const password = new Password(plainPassword);

        const isTheSameValueResult = password.isTheSameValue(plainPassword);

        expect(password).toBeTruthy();
        expect(isTheSameValueResult).toBeTruthy();
    });

    it("Should return false if the password passed has a different value as the saved one", () => {
        const plainPassword = "password";
        const password = new Password(plainPassword);

        const isTheSameValueResult = password.isTheSameValue("diferentValue");

        expect(password).toBeTruthy();
        expect(isTheSameValueResult).toBeFalsy();
    })
})