import { CompletedForm, Employee, Form, Question, Option, Response } from "@prisma/client";
import { DefaultSession } from "next-auth";

export interface CompletedFormWithRelations extends CompletedForm {
    employee: Employee | null;
    form: Form | null;
    responses: Response[];
}

export interface QuestionsWithRelations extends Question {
    options: Option[]
}

export interface FormWithRelations extends Form {
    questions: QuestionsWithRelations[] | null
    employees: Employee[] | null
}


export interface EmployeeWithRelations extends Employee {
    CompletedForm: CompletedFormWithRelations | null;
    form: FormWithRelations | null;
}

export enum questionTypes {
    text = "Texto",
    radio = "Radio",
    checkbox = "Checkbox",
    description = "Descripción"
}

declare module "next-auth" {
    interface Session {
        user: {
            id: string; // ✅ Agregamos 'id' al usuario
        } & DefaultSession["user"];
    }

    interface JWT {
        id: string;
    }
}


