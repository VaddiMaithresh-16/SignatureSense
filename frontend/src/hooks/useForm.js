import { useState } from 'react';

export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setValues((prev) => ({
        ...prev,
        [name]: files[0] || null,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const reset = () => {
    setValues(initialValues);
  };

  const setValue = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    values,
    handleChange,
    reset,
    setValue,
    setValues,
  };
};
