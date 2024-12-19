import { CompletedForm, Employee, Form, Question, Option, Response } from "@prisma/client";

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
}


export interface EmployeeWithRelations extends Employee {
    CompletedForm: CompletedFormWithRelations | null;
    form: FormWithRelations | null;
}


