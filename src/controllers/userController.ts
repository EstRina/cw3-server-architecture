import {UserService} from "../service/userService.ts";
import {parseBody} from "../utils/tools.ts";
import {IncomingMessage, ServerResponse} from "node:http";
import {User} from "../model/userTypes.ts";
import * as url from "node:url";
import {myLogger} from "../utils/logger.ts";


export class UserController {
    constructor(private userService: UserService) {

    }


    async addUser(req:IncomingMessage, res:ServerResponse) {
        const body = await parseBody(req) as User;
        if (!body.id || !body.userName) {
            myLogger.log(`Failed to add user: Invalid user data (id: ${body.id}, userName: ${body.userName})`);
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("Invalid user data");
            return;
        }
        const isSuccess = this.userService.addUser(body);
        if (isSuccess) {
            myLogger.log(`User added: id=${body.id}, userName=${body.userName}`);
            myLogger.save(`User added: id=${body.id}, userName=${body.userName}`);
            res.writeHead(201, {"Content-Type": "text/plain"});
            res.end("User was added")
        } else {
            myLogger.log(`Failed to add user: id=${body.id} already exists`);
            res.writeHead(409, {"Content-Type": "text/plain"});
            res.end("User already exists")

        }
    }

    async getAllUsers(req: IncomingMessage, res: ServerResponse) {
        try {
            const users = this.userService.getAllUsers();
            myLogger.log(`Retrieved all users: ${users.length} users`);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(users));
        } catch (error) {
            myLogger.log(`Error retrieving users: ${error}`);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal server error");
        }
    }

    async removeUser(req:IncomingMessage, res:ServerResponse, userId: number | null) {
        if (!userId) {
            myLogger.log("Failed to remove user: No userId provided");
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("No userId provided");
            return;
        }
        const removedUser = this.userService.removeUser(userId);
        if (removedUser) {
            myLogger.log(`User removed: id=${removedUser.id}, userName=${removedUser.userName}`);
            myLogger.save(`User removed: id=${removedUser.id}, userName=${removedUser.userName}`);
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify({
                message: "User deleted successfully",
                deletedUser: removedUser
            }))
            myLogger.save(`User with id ${removedUser.id} was removed`)
        } else {
            myLogger.log(`Failed to remove user: id=${userId} not found`);
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.end("User not found");
        }
        }

    async updateUser(req:IncomingMessage, res:ServerResponse, userId: number | null) {
        const body = await parseBody(req) as User;
        if (!body.id || !body.userName || body.id !== userId) {
            myLogger.log(`Failed to update user: Invalid user data or mismatched ID (id: ${body.id}, userId: ${userId})`);
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("Invalid user data or mismatched ID");
            return;
        }
        const isSuccess = this.userService.updateUser(body)
        if (isSuccess) {
            myLogger.log(`User updated: id=${body.id}, userName=${body.userName}`);
            myLogger.save(`User updated: id=${body.id}, userName=${body.userName}`);
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.end(`User id:${body.id} was updated`)

        } else {
            myLogger.log(`Failed to update user: id=${body.id} not found`);
            res.writeHead(404, {'Content-Type': 'text/html'})
            res.end('User not found')
        }

    }

    async getUser(req:IncomingMessage, res:ServerResponse, userId: number | null) {
        const user = this.userService.getUser(userId);
        if (user) {
            myLogger.log(`User retrieved: id=${userId}, userName=${user.userName}`);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(user));
        } else {
            myLogger.log(`Failed to get user: id=${userId} not found`);
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("User not found");
        }

    }


    async getLogs(req: IncomingMessage, res: ServerResponse) {
        try {
            const logs = myLogger.getLogArray();
            myLogger.log(`Retrieved logs: ${logs.length} entries`);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(logs));
        } catch (error) {
            myLogger.log(`Error retrieving logs: ${error}`);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal server error");
        }
    }

}