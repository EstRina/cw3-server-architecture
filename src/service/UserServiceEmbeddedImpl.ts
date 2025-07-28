import {UserService} from "./UserService.ts";
import {User} from "../model/userTypes.ts";
import {myLogger} from "../utils/logger.ts";
import {UserFilePersistenceService} from "./UserFilePersistenceService.ts";
import * as fs from "node:fs";


export class UserServiceEmbeddedImpl implements UserService, UserFilePersistenceService{
    private users: User[] = [];
    // private rs = fs.createReadStream('data.txt',
    //     {encoding: 'utf8', highWaterMark: 24});

    addUser(user: User): boolean {
        if (!user.id || !user.userName) {
            myLogger.log(`Failed to add user: Invalid user data)`);
            return false;
        }
        if (this.users.findIndex((u: User) => u.id === user.id) === -1) {
            this.users.push(user);
            myLogger.log(`User with id ${user.id} was successfully added`);
            return true;
        }
        myLogger.log(`Response for add user with id ${user.id} was send`)
        return false;
    }

    getAllUsers(): User[] {
        myLogger.log(`Retrieved all users: ${this.users.length} users`);
        return [...this.users];
    }

    getUser(userId: number | null): User | null {
        const user = this.users.find(user => user.id === userId);
        if (user) {
            myLogger.log(`User retrieved: id=${userId}, userName=${user.userName}`);
        } else {
            myLogger.log(`Failed to get user: id=${userId} not found`);
        }
        return user || null;
    }

    removeUser(userId: number | null): User | null {
        if (userId === null) {
            myLogger.log("Failed to remove user: Invalid userId");
            return null;
        }
        const userIndex = this.users.findIndex(user => user.id === userId);
        if(userIndex !== -1) {
            const removedUser = (this.users)[userIndex];
            this.users.splice(userIndex, 1);
            myLogger.log(`User removed: id=${removedUser.id}, userName=${removedUser.userName}`);
            return removedUser;
        }
        myLogger.log(`Failed to remove user: id=${userId} not found`);
        return null;
    }

    updateUser(newUserData: User): boolean {
        if (!newUserData.id || !newUserData.userName) {
            myLogger.log(`Failed to update user: Invalid user data`);
            return false;
        }
        const userIndex = this.users.findIndex(user => user.id === newUserData.id);
        if (userIndex !== -1) {
            (this.users)[userIndex] = newUserData;
            myLogger.log(`User updated: id=${newUserData.id}, userName=${newUserData.userName}`);
            return true;
        }
        return false;

    }

    // restoreDataFromFile(): string {
    //     let result = ""
    //     this.rs.on('data', (chunk) => {
    //         if(chunk) {
    //             result += chunk.toString();
    //         } else {
    //             result = "[]";
    //         }
    //     })
    //     this.rs.on('end', () => {
    //         if(result){
    //             this.users = JSON.parse(result);
    //             myLogger.log("Data was restored");
    //             myLogger.save("Data was restored");
    //             this.rs.destroy();
    //         } else {
    //             this.users = [{id:123, userName: "Panikovsky"}]
    //         }
    //     })
    //     this.rs.on('error', () => {
    //         this.users = [{id:2, userName: "Bender"}]
    //         myLogger.log("File to restore not found")
    //     })
    //     return "Ok";
    // }
    //
    // saveDataToFile(): string {
    //     const ws = fs.createWriteStream('data.txt', {flags: "r+"})
    //     myLogger.log("Write stream created")
    //     const data = JSON.stringify(this.users);
    //     myLogger.log(data)
    //     ws.write(data);
    //     ws.on('end', () => {
    //         myLogger.log("Data was saved");
    //         myLogger.save("Data was saved");
    //         ws.destroy();
    //     })
    //     ws.on('error', () => {
    //         myLogger.log("Error saving data.");
    //     })
    //     return "Ok";
    // }

    restoreDataFromFile(): string {
        try {
            if (fs.existsSync('data.txt')) {
                const data = fs.readFileSync('data.txt', 'utf8');
                if (data.trim()) {
                    this.users = JSON.parse(data);
                    myLogger.log("Data was restored");
                    myLogger.save("Data was restored");
                } else {
                    this.users = [{id:123, userName: "Panikovsky"}];
                }
            } else {
                this.users = [{id:123, userName: "Panikovsky"}];
                myLogger.log("File to restore not found");
            }
        } catch (error) {
            this.users = [{id:2, userName: "Bender"}];
            myLogger.log("Error restoring data from file");
        }
        return "Ok";
    }

    saveDataToFile(): string {
        try {
            const data = JSON.stringify(this.users);
            fs.writeFileSync('data.txt', data, 'utf8');
            myLogger.log("Data was saved");
            myLogger.save("Data was saved");
        } catch (error) {
            myLogger.log("Error saving data to file");
        }
        return "Ok";
    }

}