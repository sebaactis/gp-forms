import { CompletedForm, Employee, Form, Question } from "@prisma/client";

export interface CompletedFormWithRelations extends CompletedForm {
    employee: Employee | null;
    form: Form | null;
}

export interface EmployeeWithRelations extends Employee {
    completedForm: CompletedFormWithRelations | null;
    form: Form | null;
    
}

export interface FormWithRelations extends Form {
    questions: Question[] | null
}
