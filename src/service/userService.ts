import {User} from "../model/userTypes.ts";

export interface UserService {
    addUser(user: User): boolean;
    getAllUsers(): User[];
    updateUser(newUserData:User):boolean;
    removeUser(userId: number | null):User | null;
    getUser(userId: number | null):User | null

}