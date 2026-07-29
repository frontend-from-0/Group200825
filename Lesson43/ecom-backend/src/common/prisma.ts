import {PrismaClient} from '../../prisma/generated/prisma/client';
import './env';


const prisma = new PrismaClient();

export {prisma};