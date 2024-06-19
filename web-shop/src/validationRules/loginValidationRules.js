import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from "@/constants";

export function useValidationRules() {
  const required = (value) => !!value || "This field is required.";
  const minLength = (length) => (value) =>
    value.length >= length || `Minimum length is ${length} characters.`;
  const maxLength = (length) => (value) =>
    value.length <= length || `Maximum length is ${length} characters.`;

  const usernameRules = [
    required,
    minLength(NAME_MIN_LENGTH),
    maxLength(NAME_MAX_LENGTH),
  ];
  const passwordRules = [
    required,
    minLength(PASSWORD_MIN_LENGTH),
    maxLength(PASSWORD_MAX_LENGTH),
  ];

  return {
    usernameRules,
    passwordRules,
  };
}
