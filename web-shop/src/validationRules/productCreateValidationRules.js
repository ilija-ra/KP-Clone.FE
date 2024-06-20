// src/validationRules/productValidationRules.ts
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  PRICE_MIN_VALUE,
} from "@/constants";

export function useValidationRules() {
  const required = (value) => !!value || "This field is required.";
  const minLength = (length) => (value) =>
    value.length >= length || `Minimum length is ${length} characters.`;
  const maxLength = (length) => (value) =>
    value.length <= length || `Maximum length is ${length} characters.`;
  const positiveNumber = (value) =>
    value > PRICE_MIN_VALUE || `Price must be greater than ${PRICE_MIN_VALUE}.`;

  const nameRules = [
    required,
    minLength(NAME_MIN_LENGTH),
    maxLength(NAME_MAX_LENGTH),
  ];
  const descriptionRules = [required, maxLength(DESCRIPTION_MAX_LENGTH)];
  const imageRules = [required];
  const priceRules = [required, positiveNumber];
  const saleTypeRules = [required];
  const sellerRules = [required];
  const categoryRules = [required];

  return {
    nameRules,
    descriptionRules,
    priceRules,
    saleTypeRules,
    categoryRules,
    imageRules,
  };
}
