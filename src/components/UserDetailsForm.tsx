import { useMemo } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { FormState, UserFormSubmission } from "./formState";

const jobRoles = ["Software Engineer", "Data Analyst", "Manager"];
const employmentTypes = ["Full-time", "Part-time"];
const genders = ["Male", "Female", "Non-binary"];
const ethnicities = ["White", "Black", "Mixed", "Arab", "Asian", "Other"];
const educationLevels = ["Master's", "PhD", "Bachelor's", "High School"];

type UserDetailsFormProps = {
  values: FormState;
  onValuesChange: (nextValues: FormState) => void;
  onSubmit: (data: UserFormSubmission) => void;
};

const UserDetailsForm = ({
  values,
  onValuesChange,
  onSubmit,
}: UserDetailsFormProps) => {
  const employmentTypeOptions = useMemo(() => employmentTypes, []);
  const genderOptions = useMemo(() => genders, []);
  const ethnicityOptions = useMemo(() => ethnicities, []);
  const educationOptions = useMemo(() => educationLevels, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    onValuesChange({ ...values, [name]: value });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedSubmission: UserFormSubmission = {
      jobRole: values.jobRole,
      salary: Number(values.salary),
      employmentType: values.employmentType,
      gender: values.gender,
      age: Number(values.age),
      experience: Number(values.experience),
      children: Number(values.children),
      ethnicity: values.ethnicity,
      education: values.education,
    };

    onSubmit(parsedSubmission);
  };

  return (
    <form className="user-details-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="jobRole">Job role</label>
        <input
          list="jobRoleOptions"
          id="jobRole"
          name="jobRole"
          value={values.jobRole}
          onChange={handleChange}
          placeholder="Start typing or choose a role"
          required
        />
        <datalist id="jobRoleOptions">
          {jobRoles.map((role) => (
            <option value={role} key={role} />
          ))}
        </datalist>
      </div>

      <div className="form-field">
        <label htmlFor="salary">Salary (GBP annual)</label>
        <input
          type="number"
          id="salary"
          name="salary"
          value={values.salary}
          onChange={handleChange}
          min="0"
          placeholder="e.g. 65000"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="employmentType">Employment type</label>
        <select
          id="employmentType"
          name="employmentType"
          value={values.employmentType}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select one...
          </option>
          {employmentTypeOptions.map((type) => (
            <option value={type} key={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          name="gender"
          value={values.gender}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select one...
          </option>
          {genderOptions.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="age">Age</label>
        <input
          type="number"
          id="age"
          name="age"
          value={values.age}
          onChange={handleChange}
          min="16"
          placeholder="Enter your age"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="experience">Experience (years)</label>
        <input
          type="number"
          id="experience"
          name="experience"
          value={values.experience}
          onChange={handleChange}
          min="0"
          placeholder="Years of experience"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="children">Children</label>
        <input
          type="number"
          id="children"
          name="children"
          value={values.children}
          onChange={handleChange}
          min="0"
          placeholder="Number of children"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="ethnicity">Ethnicity</label>
        <select
          id="ethnicity"
          name="ethnicity"
          value={values.ethnicity}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select one...
          </option>
          {ethnicityOptions.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="education">Education</label>
        <select
          id="education"
          name="education"
          value={values.education}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select one...
          </option>
          {educationOptions.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Calculate</button>
    </form>
  );
};

export default UserDetailsForm;
