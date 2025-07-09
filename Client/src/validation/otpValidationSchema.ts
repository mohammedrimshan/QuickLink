import * as yup from 'yup';

const otpValidationSchema = yup.object().shape({
  otp: yup
    .string()
    .required('Please enter the complete 6-digit OTP')
    .matches(/^\d{6}$/, 'OTP must be a 6-digit number')
});

export default otpValidationSchema;