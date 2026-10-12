import { useCallback, useRef, useState } from "react";
import { FIELDS, validateAll, validateField } from "../utils/validators";

const ENDPOINT = "https://api.web3forms.com/submit";
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
const TIMEOUT_MS = 15000;

const initialValues = { name: "", email: "", subject: "", message: "" };

export function useContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorType, setErrorType] = useState(null); // config | network | timeout | server
  const submittingRef = useRef(false); // blocks double-click before state updates

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));

      // Once a field was visited, re-validate while the user types
      if (touched[name]) {
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
      }
      // Typing after a finished attempt returns the form to the normal state
      setStatus((s) => (s === "success" || s === "error" ? "idle" : s));
    },
    [touched]
  );

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }, []);

  // Returns { ok: false, firstInvalid } when validation fails
  const submit = useCallback(
    async (honeypot) => {
      if (submittingRef.current) return { ok: false };

      const allErrors = validateAll(values);
      setTouched(Object.fromEntries(FIELDS.map((f) => [f, true])));
      setErrors(allErrors);

      const firstInvalid = FIELDS.find((f) => allErrors[f]);
      if (firstInvalid) return { ok: false, firstInvalid };

      // No key = we cannot really send, so we say so honestly
      if (!ACCESS_KEY) {
        setErrorType("config");
        setStatus("error");
        return { ok: false };
      }

      submittingRef.current = true;
      setStatus("submitting");
      setErrorType(null);

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: ACCESS_KEY,
            from_name: "Saman.dev portfolio",
            name: values.name.trim(),
            email: values.email.trim(),
            subject: values.subject.trim(),
            message: values.message.trim(),
            botcheck: honeypot ? "true" : "",
          }),
          signal: controller.signal,
        });

        const data = await res.json().catch(() => null);

        // Success only when the server itself confirms it
        if (res.ok && data?.success === true) {
          setStatus("success");
          setValues(initialValues);
          setTouched({});
          setErrors({});
          return { ok: true };
        }

        setErrorType("server");
        setStatus("error");
        return { ok: false };
      } catch (err) {
        setErrorType(err.name === "AbortError" ? "timeout" : "network");
        setStatus("error");
        return { ok: false };
      } finally {
        clearTimeout(timer);
        submittingRef.current = false;
      }
    },
    [values]
  );

  return { values, errors, status, errorType, handleChange, handleBlur, submit };
}