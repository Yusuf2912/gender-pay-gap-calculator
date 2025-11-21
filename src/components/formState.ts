export type FormState = {
  jobRole: string;
  salary: string;
  employmentType: string;
  gender: string;
  age: string;
  experience: string;
  children: string;
  ethnicity: string;
  education: string;
};

export type UserFormSubmission = {
  jobRole: string;
  salary: number;
  employmentType: string;
  gender: string;
  age: number;
  experience: number;
  children: number;
  ethnicity: string;
  education: string;
};

export const createEmptyFormState = (): FormState => ({
  jobRole: "",
  salary: "",
  employmentType: "",
  gender: "",
  age: "",
  experience: "",
  children: "",
  ethnicity: "",
  education: "",
});
