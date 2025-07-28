import {createServer} from "node:http";
import {PORT} from "./config/userServerConfig.ts";
import {UserServiceEmbeddedImpl} from "./service/UserServiceEmbeddedImpl.ts";
import {UserController} from "./controllers/userController.ts";
import {userRouters} from "./routers/userRoutes.ts";
import {myLogger} from "./utils/logger.ts";

export const launchServer = (): void => {
    const userService = new UserServiceEmbeddedImpl();
    userService.restoreDataFromFile();
    const userController:UserController = new UserController(userService);

    createServer(async (req, res) => {
        await userRouters(req, res, userController)
    }).listen(PORT, () => {
        console.log(`UserServer running at http://localhost:${PORT}`)
    })

    process.on('SIGINT', () => {
        userService.saveDataToFile();
        myLogger.log("Saving user data...");
        myLogger.saveToFile("Server shutdown by CTRL+C")
        process.exit();
    })
}