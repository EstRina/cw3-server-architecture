export interface UserFilePersistenceService {
    saveDataToFile():Promise<string>;
    restoreDataFromFile():Promise<string>;
}