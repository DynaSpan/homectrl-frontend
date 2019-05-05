export class UserDTO {
    public id: string;
    public username: string;
    public name: string;
    public active: boolean;
    public language: UserLanguage;

    public permissions: string[];
}

export enum UserLanguage {
    English = 0,
    Dutch = 1
}