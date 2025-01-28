import { CompletedForm, Employee, Form, Question, Option, Response } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";

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
            id: string;
            role: string; // Add 'role' to the session user
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string;
        role: string;
    }

    interface JWT {
        id: string;
        role: string;
    }
}


