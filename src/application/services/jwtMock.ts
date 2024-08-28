import { IJwtService } from "./jwt";

export class JwtMock implements IJwtService {
    async generateToken(data: Record<any, any>): Promise<{ token: string; }> {
        return { token: "mockedToken" }
    }
}