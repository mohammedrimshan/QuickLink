import * as yup from 'yup';

const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required('Please enter your email')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'),
  password: yup
    .string()
    .required('Please enter your password')
});

export default loginValidationSchema;