import { useMemo, useState } from 'react';

type FormState = {
  jobRole: string;
  salary: string;
  employmentType: string;
  gender: string;
  age: string;
  experience: string;
  children: string;
  ethnicity: string;
};

const jobRoles = ['Software Engineer', 'Data Analyst', 'Manager'];
const employmentTypes = ['Full-time', 'Part-time'];
const genders = ['Male', 'Female', 'Non-binary'];
const ethnicities = ['White', 'Black', 'Mixed', 'Arab', 'Asian', 'Other'];

const emptyState: FormState = {
  jobRole: '',
  salary: '',
  employmentType: '',
  gender: '',
  age: '',
  experience: '',
  children: '',
  ethnicity: '',
};

const UserDetailsForm = () => {
  const [formValues, setFormValues] = useState<FormState>(emptyState);

  const employmentTypeOptions = useMemo(() => employmentTypes, []);
  const genderOptions = useMemo(() => genders, []);
  const ethnicityOptions = useMemo(() => ethnicities, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder for submit handling logic.
    console.log('Form submission', formValues);
  };

  return (
    <form className="user-details-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="jobRole">Job role</label>
        <input
          list="jobRoleOptions"
          id="jobRole"
          name="jobRole"
          value={formValues.jobRole}
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
          value={formValues.salary}
          onChange={handleChange}
          min="0"
          step="1000"
          placeholder="e.g. 65000"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="employmentType">Employment type</label>
        <select
          id="employmentType"
          name="employmentType"
          value={formValues.employmentType}
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
          value={formValues.gender}
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
          value={formValues.age}
          onChange={handleChange}
          min="16"
          max="100"
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
          value={formValues.experience}
          onChange={handleChange}
          min="0"
          max="50"
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
          value={formValues.children}
          onChange={handleChange}
          min="0"
          max="10"
          placeholder="Number of children"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="ethnicity">Ethnicity</label>
        <select
          id="ethnicity"
          name="ethnicity"
          value={formValues.ethnicity}
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

      <button type="submit">Calculate</button>
    </form>
  );
};

export default UserDetailsForm;
