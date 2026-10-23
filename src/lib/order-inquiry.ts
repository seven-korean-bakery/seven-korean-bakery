export const inquiryFields = [
  "name",
  "phone",
  "email",
  "product",
  "quantity",
  "date",
  "time",
  "occasion",
  "requests",
] as const;
export type InquiryField = (typeof inquiryFields)[number];
export type InquiryValues = Record<InquiryField, string>;
export type InquiryError =
  | "requiredError"
  | "phoneError"
  | "emailError"
  | "quantityError"
  | "dateError"
  | "timeError"
  | "lengthError";
export type InquiryErrors = Partial<Record<InquiryField, InquiryError>>;

export function validateInquiry(
  values: InquiryValues,
  today: string,
): InquiryErrors {
  const errors: InquiryErrors = {};
  for (const field of inquiryFields) {
    const value = values[field].trim();
    if (!["email", "time", "requests"].includes(field) && !value) {
      errors[field] = "requiredError";
      continue;
    }
    if (value.length > (field === "requests" ? 2000 : 254))
      errors[field] = "lengthError";
  }
  if (
    values.phone.trim() &&
    (!/^[+\d\s().-]+$/.test(values.phone) ||
      !/^\d{7,15}$/.test(values.phone.replace(/\D/g, "")))
  )
    errors.phone = "phoneError";
  if (
    values.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
  )
    errors.email = "emailError";
  if (
    values.quantity &&
    (!/^[1-9]\d*$/.test(values.quantity) ||
      !Number.isSafeInteger(Number(values.quantity)))
  )
    errors.quantity = "quantityError";
  if (values.date) {
    const date = new Date(`${values.date}T12:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(values.date) ||
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== values.date ||
      values.date < today
    )
      errors.date = "dateError";
  }
  if (values.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(values.time))
    errors.time = "timeError";
  return errors;
}
