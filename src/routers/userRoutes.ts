import {IncomingMessage, ServerResponse} from "node:http";
import {UserController} from "../controllers/userController.ts";

export const userRouters =
    async(req:IncomingMessage, res:ServerResponse, controller:UserController) => {
const {url, method} = req;

        const match = url?.match(/\/api\/users\/(\d+)/);
        const userId = match ? parseInt(match[1], 10) : null;
        const baseUrl = userId !== null ? "api/users/:id" : url?.replace(/^\/+/, "") || "";

switch (`${baseUrl}` + `${method}`) {
    case "api/users" + "POST" : {
        await controller.addUser(req,res);
        break;
    }
    case "api/users" + "GET" : {
        await controller.getAllUsers(req,res);
        break;
    }
    case "api/users/:id" + "DELETE" : {
        await controller.removeUser(req,res,userId);
        break;
    }
    case "api/users/:id" + "PUT" : {
        await controller.updateUser(req,res, userId);
        break;
    }
    case "api/users/:id" + "GET" : {
        await controller.getUser(req,res, userId);
        break;
    }

    default: {
        res.writeHead(404, {"Content-Type": "text/plain"})
        res.end("Page Not Found");
    }
}
}