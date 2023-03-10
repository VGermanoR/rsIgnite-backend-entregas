import { hash } from "bcrypt";
import { prisma } from "../../../database/prismaClient";

interface ICreateClient {
    username: string;
    password: string;
}

export class CreateClientUseCase {

    async execute ({ username, password }: ICreateClient) {
        // Validate if client already exists
        const clientExists = await prisma.clients.findFirst({ where: { username: {
            mode: 'insensitive'
        } } });

        if (clientExists) throw new Error('Client already exists');

        // Encrypt password
        const hashPassword = await hash(password, 10);

        // Save client
        const client = await prisma.clients.create({
            data: {
                username,
                password: hashPassword
            }
        })

        return client;
    }
}