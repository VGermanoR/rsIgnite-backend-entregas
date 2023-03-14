import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { prisma } from "../../../database/prismaClient";

interface IAuthenticateClient {
    username: string;
    password: string;
}

export class AuthenticateClientUseCase {
    async execute({ username, password }: IAuthenticateClient) {
        const client = await prisma.clients.findFirst({
            where: {
                username
            }
        });

        if (!client) throw new Error('Username or password invalid!');

        const passwordMatch = await compare(password, client.password);

        if (!passwordMatch) throw new Error('Username or password invalid!');

        const token = sign({ username }, '6094cac7e083e41ce519194bfe33a50c83b9e56b', {
            subject: client.id,
            expiresIn: '1d'
        });

        return token;
    }
}