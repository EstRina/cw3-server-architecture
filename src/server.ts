import {createServer} from "node:http";
import {PORT} from "./config/userServerConfig.ts";
import {UserServiceEmbeddedImpl} from "./service/userServiceEmbeddedImpl.ts";
import {UserController} from "./controllers/userController.ts";
import {userRouters} from "./routers/userRoutes.ts";

export const launchServer = (): void => {
    const userService = new UserServiceEmbeddedImpl();
    const userController:UserController = new UserController(userService);

    createServer(async (req, res) => {
        await userRouters(req, res, userController)
    }).listen(PORT, () => {
        console.log(`UserServer running at http://localhost:${PORT}`)
    })
}