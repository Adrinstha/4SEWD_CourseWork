export function validatePassword(password) {
  if (!password) {
    return {
      isValid: false,
      strength: "weak",
      requirements: [],
      errors: ["Password is required."],
    };
  }

  const requirements = [
    {
      id: "length",
      text: "At least 8 characters long",
      isMet: password.length >= 8,
    },
    {
      id: "uppercase",
      text: "At least one uppercase letter (A-Z)",
      isMet: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      text: "At least one lowercase letter (a-z)",
      isMet: /[a-z]/.test(password),
    },
    {
      id: "number",
      text: "At least one number (0-9)",
      isMet: /[0-9]/.test(password),
    },
    {
      id: "special",
      text: "At least one special character (!@#$%^&*...)",
      isMet: /[!@#$%^&*(),.?":{}|<>\-_+=\\/\[\]~`]/.test(password),
    },
  ];

  const metCount = requirements.filter((r) => r.isMet).length;
  const isValid = metCount === requirements.length;

  let strength = "weak";
  if (metCount === 5) {
    strength = "strong";
  } else if (metCount >= 3) {
    strength = "medium";
  }

  const errors = requirements.filter((r) => !r.isMet).map((r) => r.text);

  return {
    isValid,
    strength,
    metCount,
    totalCount: requirements.length,
    requirements,
    errors,
  };
}
