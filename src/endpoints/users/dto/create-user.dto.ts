import { Branch } from "src/entities/branch.entity";

export class CreateUserDto {
    username: string;
    password: string;
    name: string;
    branch: Branch;
}
