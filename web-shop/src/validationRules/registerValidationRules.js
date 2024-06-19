import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  PHONE_NUMBER_MIN_LENGTH,
  PHONE_NUMBER_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from "@/constants";

export function useValidationRules() {
  const required = (value) => !!value || "This field is required.";
  const minLength = (length) => (value) =>
    value.length >= length || `Minimum length is ${length} characters.`;
  const maxLength = (length) => (value) =>
    value.length <= length || `Maximum length is ${length} characters.`;
  const email = (value) => /.+@.+\..+/.test(value) || "Invalid email format.";
  const noDigits = (value) => /[^0-9]/.test(value) || "Cannot contain digits.";

  const firstNameRules = [
    required,
    minLength(NAME_MIN_LENGTH),
    maxLength(NAME_MAX_LENGTH),
  ];
  const lastNameRules = [
    required,
    minLength(NAME_MIN_LENGTH),
    maxLength(NAME_MAX_LENGTH),
  ];
  const usernameRules = [
    required,
    minLength(NAME_MIN_LENGTH),
    maxLength(NAME_MAX_LENGTH),
  ];
  const emailRules = [required, email];
  const phoneNumberRules = [
    required,
    minLength(PHONE_NUMBER_MIN_LENGTH),
    maxLength(PHONE_NUMBER_MAX_LENGTH),
  ];
  const passwordRules = [
    required,
    minLength(PASSWORD_MIN_LENGTH),
    maxLength(PASSWORD_MAX_LENGTH),
  ];

  // Custom validation rule to check if confirmPassword matches password
  const confirmedPasswordRules = (password) => (value) =>
    value === password || "Passwords do not match.";

  const confirmPasswordRules = (password) => [
    required,
    minLength(PASSWORD_MIN_LENGTH),
    maxLength(PASSWORD_MAX_LENGTH),
    confirmedPasswordRules(password),
  ];

  const roleRules = [required];

  return {
    firstNameRules,
    lastNameRules,
    usernameRules,
    emailRules,
    phoneNumberRules,
    passwordRules,
    confirmPasswordRules,
    roleRules,
  };
}
