import { useState } from "react";
import "./App.css";
import UserDetailsForm from "./components/UserDetailsForm";
import ResultsPage from "./components/ResultsPage";
import { createEmptyFormState } from "./components/formState";
import type { FormState, UserFormSubmission } from "./components/formState";

function App() {
  const [formValues, setFormValues] = useState<FormState>(() =>
    createEmptyFormState()
  );
  const [submission, setSubmission] = useState<UserFormSubmission | null>(null);

  const handleValuesChange = (nextValues: FormState) => {
    setFormValues(nextValues);
  };

  const handleSubmit = (nextSubmission: UserFormSubmission) => {
    setSubmission(nextSubmission);
  };

  const handleEdit = () => {
    setSubmission(null);
  };

  return (
    <>
      <h1>Welcome to Clarity</h1>
      <h2>Discover how fairly you are paid</h2>
      {submission ? (
        <ResultsPage submission={submission} onEdit={handleEdit} />
      ) : (
        <UserDetailsForm
          values={formValues}
          onValuesChange={handleValuesChange}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}

export default App;
