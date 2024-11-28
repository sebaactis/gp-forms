export interface CompletedFormWithRelations extends CompletedForm {
    employee: Employee | null;
    form: Form | null;
}