const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MESSAGE_MAX = 1000;
export const FIELDS = ["name", "email", "subject", "message"];

// Returns "" when valid, or an error key like "required"
export function validateField(name, value = "") {
  const v = value.trim();

  switch (name) {
    case "name":
      if (!v) return "required";
      if (v.length < 2) return "nameShort";
      return "";

    case "email":
      if (!v) return "required";
      if (!EMAIL_RE.test(v)) return "emailInvalid";
      return "";

    case "subject":
      if (!v) return "required";
      if (v.length < 3) return "subjectShort";
      return "";

    case "message":
      if (!v) return "required";
      if (v.length < 10) return "messageShort";
      if (v.length > MESSAGE_MAX) return "messageLong";
      return "";

    default:
      return "";
  }
}

// { name: "", email: "emailInvalid", ... } with only the invalid fields kept
export function validateAll(values) {
  const errors = {};
  FIELDS.forEach((field) => {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  });
  return errors;
}