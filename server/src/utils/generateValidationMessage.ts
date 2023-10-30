export const generateValidationMessage = (
  type: string,
  property?: string,
  restriction?: number
) => {
  if (type === 'min') {
    return `The ${property} should be at least ${restriction} characters.`;
  }

  if (type === 'max') {
    return `The ${property} should be fewer than ${restriction} characters.`;
  }

  if (type === 'required') {
    return `The ${property} is required.`;
  }

  if (type === 'email') {
    return 'The email address is not valid.';
  }

  if (type === 'passwordConfirmation') {
    return 'The passwords do not match.';
  }
};
