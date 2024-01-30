import { IsNotEmpty, IsString } from "class-validator";

export class CreateProjectDto {
    @IsNotEmpty()
    @IsString()
    name:string
    @IsNotEmpty()
    @IsString()
    description:string
    @IsNotEmpty()
    @IsString()
    skills:string
    @IsString()
    repository:string
    @IsNotEmpty()
    @IsString()
    image:string
}
