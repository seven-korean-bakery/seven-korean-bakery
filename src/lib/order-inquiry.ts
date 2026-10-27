export const purposes = ["event", "everyday", "favors"] as const;
export const eventTypes = [
  "baekil",
  "dol",
  "birthday",
  "corporate",
  "other",
] as const;
export const budgetRanges = [
  "8-10",
  "10-15",
  "15-20",
  "20+",
  "consultation",
] as const;
export const answers = ["no", "yes", "unsure"] as const;
export type Purpose = (typeof purposes)[number];
export type EventType = (typeof eventTypes)[number];
export type BudgetRange = (typeof budgetRanges)[number];
export type Answer = (typeof answers)[number];
export const inquiryFields = [
  "purpose",
  "eventType",
  "eventOther",
  "eventCount",
  "eventCountUnit",
  "products",
  "everydayDetails",
  "quantity",
  "budget",
  "lidPrinting",
  "printedMessage",
  "allergies",
  "allergyDetails",
  "requests",
  "date",
  "time",
  "name",
  "phone",
  "email",
] as const;
export type InquiryField = (typeof inquiryFields)[number];
// Draft strings match native controls; validated data below uses stable enum IDs
// and numbers, independent of display language or future spreadsheet columns.
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
type CommonData = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  requests: string;
  allergy: { status: "no" } | { status: "yes" | "unsure"; details: string };
};
export type InquiryData = CommonData &
  (
    | {
        purpose: "event";
        event:
          | { type: Exclude<EventType, "other"> }
          | { type: "other"; description: string };
        count: number;
        countUnit: "guests" | "items";
        products: string;
      }
    | { purpose: "everyday"; details: string }
    | {
        purpose: "favors";
        quantity: number;
        budget: BudgetRange;
        currency: "CAD";
        printing:
          { choice: "no" | "unsure" } | { choice: "yes"; message: string };
      }
  );
export function emptyInquiry(): InquiryValues {
  return Object.fromEntries(
    inquiryFields.map((field) => [field, ""]),
  ) as InquiryValues;
}

export function activeInquiryFields(v: InquiryValues): InquiryField[] {
  return [
    "purpose",
    ...(v.purpose === "event"
      ? [
          "eventType",
          ...(v.eventType === "other" ? ["eventOther"] : []),
          "eventCount",
          "eventCountUnit",
          "products",
        ]
      : v.purpose === "everyday"
        ? ["everydayDetails"]
        : v.purpose === "favors"
          ? [
              "quantity",
              "budget",
              "lidPrinting",
              ...(v.lidPrinting === "yes" ? ["printedMessage"] : []),
            ]
          : []),
    "allergies",
    ...(v.allergies === "yes" || v.allergies === "unsure"
      ? ["allergyDetails"]
      : []),
    "requests",
    "date",
    "time",
    "name",
    "phone",
    "email",
  ] as InquiryField[];
}
export function updateInquiry(
  v: InquiryValues,
  field: InquiryField,
  value: string,
): InquiryValues {
  const next = { ...v, [field]: value };
  const active = new Set(activeInquiryFields(next));
  for (const key of inquiryFields) if (!active.has(key)) next[key] = "";
  return next;
}
export function validateInquiry(
  v: InquiryValues,
  today: string,
): InquiryErrors {
  const errors: InquiryErrors = {};
  const optional = ["products", "requests", "time", "email"];
  for (const field of activeInquiryFields(v)) {
    const value = v[field].trim();
    if (!optional.includes(field) && !value) errors[field] = "requiredError";
    if (
      value.length >
      (["requests", "everydayDetails", "allergyDetails"].includes(field)
        ? 2000
        : 254)
    )
      errors[field] = "lengthError";
  }
  const choice = (field: InquiryField, options: readonly string[]) => {
    if (!options.includes(v[field])) errors[field] = "requiredError";
  };
  choice("purpose", purposes);
  choice("allergies", answers);
  if (v.purpose === "event") {
    choice("eventType", eventTypes);
    choice("eventCountUnit", ["guests", "items"]);
  }
  if (v.purpose === "favors") {
    choice("budget", budgetRanges);
    choice("lidPrinting", answers);
  }
  const count =
    v.purpose === "event"
      ? "eventCount"
      : v.purpose === "favors"
        ? "quantity"
        : null;
  if (
    count &&
    v[count].trim() &&
    (!/^[1-9]\d*$/.test(v[count]) || !Number.isSafeInteger(Number(v[count])))
  )
    errors[count] = "quantityError";
  if (
    v.phone.trim() &&
    (!/^[+\d\s().-]+$/.test(v.phone) ||
      !/^\d{7,15}$/.test(v.phone.replace(/\D/g, "")))
  )
    errors.phone = "phoneError";
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    errors.email = "emailError";
  if (v.date) {
    const date = new Date(`${v.date}T12:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(v.date) ||
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== v.date ||
      v.date < today
    )
      errors.date = "dateError";
  }
  if (v.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(v.time))
    errors.time = "timeError";
  return errors;
}

export function parseInquiry(
  v: InquiryValues,
  today: string,
):
  | { success: false; errors: InquiryErrors }
  | { success: true; data: InquiryData } {
  const errors = validateInquiry(v, today);
  if (Object.keys(errors).length) return { success: false, errors };
  const text = (field: InquiryField) => v[field].trim();
  const common: CommonData = {
    name: text("name"),
    phone: text("phone"),
    email: text("email"),
    date: v.date,
    time: v.time,
    requests: text("requests"),
    allergy:
      v.allergies === "no"
        ? { status: "no" }
        : {
            status: v.allergies as "yes" | "unsure",
            details: text("allergyDetails"),
          },
  };
  let data: InquiryData;
  if (v.purpose === "event")
    data = {
      ...common,
      purpose: "event",
      event:
        v.eventType === "other"
          ? { type: "other", description: text("eventOther") }
          : { type: v.eventType as Exclude<EventType, "other"> },
      count: Number(v.eventCount),
      countUnit: v.eventCountUnit as "guests" | "items",
      products: text("products"),
    };
  else if (v.purpose === "everyday")
    data = { ...common, purpose: "everyday", details: text("everydayDetails") };
  else
    data = {
      ...common,
      purpose: "favors",
      quantity: Number(v.quantity),
      budget: v.budget as BudgetRange,
      currency: "CAD",
      printing:
        v.lidPrinting === "yes"
          ? { choice: "yes", message: text("printedMessage") }
          : { choice: v.lidPrinting as "no" | "unsure" },
    };
  return { success: true, data };
}
