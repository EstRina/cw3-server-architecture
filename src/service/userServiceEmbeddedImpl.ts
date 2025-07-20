import {UserService} from "./userService.ts";
import {User} from "../model/userTypes.ts";
import {myLogger} from "../utils/logger.ts";


export class UserServiceEmbeddedImpl implements UserService{
    private users: User[] = [];

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

}