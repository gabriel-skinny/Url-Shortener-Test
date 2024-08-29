export interface IJwtService {
  generateToken(data: Record<any, any>): Promise<{ token: string }>;
}
