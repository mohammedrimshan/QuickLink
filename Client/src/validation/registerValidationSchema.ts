import * as yup from 'yup';

const registerValidationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('Please enter your name'),
  email: yup
    .string()
    .trim()
    .required('Please enter your email')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'),
  phone: yup
    .string()
    .trim()
    .required('Please enter your phone number')
    .matches(/^\d{10}$/, 'Please enter a valid 10-digit phone number'),
  password: yup
    .string()
    .required('Please enter a password')
    .min(6, 'Password must be at least 6 characters long'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match')
});

export default registerValidationSchema;