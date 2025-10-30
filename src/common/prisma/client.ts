//import { userExtension } from "../../features/user/user.extension"
import { PrismaClient } from "../../generated/prisma/client"

const prisma = new PrismaClient({
    log: ['query']
})

// Apply the extension
/* const prisma = prismaClient
    .$extends(userExtension) */
//.$extends(postExtension)


export default prisma