"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { getContent } from "@/content";
import type { Locale } from "@/lib/locales";
import { business } from "@/lib/business";
import {
  activeInquiryFields,
  emptyInquiry,
  parseInquiry,
  purposes,
  updateInquiry,
  type InquiryField,
  type InquiryErrors,
} from "@/lib/order-inquiry";

const subscribe = () => () => {};

export function OrderInquiryForm({ locale }: { locale: Locale }) {
  const copy = getContent(locale).orderInquiry;
  const [values, setValues] = useState(emptyInquiry);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [checked, setChecked] = useState(false);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const summary = useRef<HTMLDivElement>(null);
  const change = (field: InquiryField, value: string) => {
    const next = updateInquiry(values, field, value);
    setValues(next);
    setChecked(false);
    // Remove obsolete errors, including those for fields just hidden.
    setErrors((previous) =>
      Object.fromEntries(
        Object.entries(previous).filter(
          ([key]) =>
            key !== field &&
            activeInquiryFields(next).includes(key as InquiryField),
        ),
      ),
    );
  };
  const error = (name: InquiryField) =>
    errors[name] && (
      <p id={`${name}-error`} className="inquiry-error">
        {copy[errors[name]]}
      </p>
    );
  const field = (
    name: Exclude<InquiryField, "purpose">,
    options: {
      optional?: boolean;
      multiline?: boolean;
      choices?: Record<string, string>;
      help?: string;
    } = {},
  ) => {
    const { optional, multiline, choices, help } = options;
    const props = {
      id: name,
      name,
      value: values[name],
      required: !optional,
      "aria-invalid": !!errors[name],
      "aria-describedby":
        [
          help && `${name}-help`,
          errors[name] && `${name}-error`,
          name === "allergies" && "allergy-notice",
        ]
          .filter(Boolean)
          .join(" ") || undefined,
      onChange: (
        event: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => change(name, event.target.value),
    };
    return (
      <div className={`inquiry-field ${multiline ? "inquiry-wide" : ""}`}>
        <label htmlFor={name}>
          {copy[name]}{" "}
          {optional ? (
            <span className="inquiry-optional">{copy.optional}</span>
          ) : (
            <span aria-hidden="true">*</span>
          )}
        </label>
        {choices ? (
          <select {...props}>
            <option value="">{copy.select}</option>
            {Object.entries(choices).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ) : multiline ? (
          <textarea {...props} rows={3} maxLength={2000} />
        ) : (
          <input
            {...props}
            type={
              name === "phone"
                ? "tel"
                : name === "email"
                  ? "email"
                  : name === "date"
                    ? "date"
                    : name === "time"
                      ? "time"
                      : "text"
            }
            inputMode={
              name === "quantity" || name === "eventCount"
                ? "numeric"
                : undefined
            }
            autoComplete={
              name === "name"
                ? "name"
                : name === "phone"
                  ? "tel"
                  : name === "email"
                    ? "email"
                    : "off"
            }
            maxLength={254}
          />
        )}
        {help && (
          <p id={`${name}-help`} className="inquiry-help">
            {help}
          </p>
        )}
        {error(name)}
      </div>
    );
  };
  return (
    <form
      noValidate
      aria-describedby="inquiry-unavailable"
      onSubmit={(event) => {
        event.preventDefault();
        const today = new Intl.DateTimeFormat("en-CA", {
          timeZone: business.timeZone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date());
        const result = parseInquiry(values, today);
        setErrors(result.success ? {} : result.errors);
        setChecked(true);
        requestAnimationFrame(() => summary.current?.focus());
        // Preview only. No network call, persistence, or simulated submission.
      }}
    >
      <p className="inquiry-help">{copy.required}</p>
      <div
        ref={summary}
        tabIndex={-1}
        role="status"
        className={checked ? "inquiry-summary" : ""}
      >
        {checked &&
          (Object.keys(errors).length ? (
            <>
              <p>{copy.summary}</p>
              <ul>
                {activeInquiryFields(values)
                  .filter((name) => errors[name])
                  .map((name) => (
                    <li key={name}>
                      <a
                        href={`#${name === "purpose" ? "purpose-event" : name}`}
                      >
                        {copy[name]}: {copy[errors[name]!]}
                      </a>
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <p>{copy.valid}</p>
          ))}
      </div>
      <fieldset
        className="inquiry-purpose"
        aria-describedby={errors.purpose ? "purpose-error" : undefined}
      >
        <legend>
          {copy.purpose} <span aria-hidden="true">*</span>
        </legend>
        <div className="purpose-cards">
          {purposes.map((purpose) => (
            <label className="purpose-card" key={purpose}>
              <input
                type="radio"
                id={`purpose-${purpose}`}
                name="purpose"
                value={purpose}
                checked={values.purpose === purpose}
                onChange={() => change("purpose", purpose)}
                required
                aria-describedby={errors.purpose ? "purpose-error" : undefined}
              />
              <span>
                <strong>{copy.purposeOptions[purpose]}</strong>
                <small>{copy.purposeDescriptions[purpose]}</small>
              </span>
            </label>
          ))}
        </div>
        {error("purpose")}
      </fieldset>
      {values.purpose && (
        <fieldset>
          <legend>{copy.order}</legend>
          {values.purpose === "event" && (
            <div className="inquiry-grid">
              {field("eventType", { choices: copy.eventOptions })}
              {values.eventType === "other" && field("eventOther")}
              {field("eventCount")}
              {field("eventCountUnit", { choices: copy.countOptions })}
              {field("products", { optional: true })}
            </div>
          )}
          {values.purpose === "everyday" &&
            field("everydayDetails", {
              multiline: true,
              help: copy.everydayHelp,
            })}
          {values.purpose === "favors" && (
            <>
              <p className="inquiry-pricing">{copy.priceNotice}</p>
              <div className="inquiry-grid">
                {field("quantity")}
                {field("budget", { choices: copy.budgetOptions })}
                {field("lidPrinting", { choices: copy.printingOptions })}
                {values.lidPrinting === "yes" && field("printedMessage")}
              </div>
              <aside className="printing-preview" aria-label={copy.photoTitle}>
                <div className="printing-placeholder" aria-hidden="true">
                  <span>✧</span>
                </div>
                <div>
                  <h3>{copy.photoTitle}</h3>
                  <p>{copy.photoPending}</p>
                  <p className="inquiry-help">{copy.photoNote}</p>
                </div>
              </aside>
            </>
          )}
        </fieldset>
      )}
      <fieldset>
        <legend>{copy.preferences}</legend>
        <div className="inquiry-grid">
          {field("allergies", { choices: copy.allergyOptions })}
          {(values.allergies === "yes" || values.allergies === "unsure") &&
            field("allergyDetails", { multiline: true })}
        </div>
        <p className="inquiry-allergy-notice" id="allergy-notice">
          {copy.allergyNotice}
        </p>
        {field("requests", { optional: true, multiline: true })}
      </fieldset>
      <fieldset>
        <legend>{copy.pickup}</legend>
        <div className="inquiry-grid">
          {field("date")}
          {field("time", { optional: true })}
        </div>
        <p className="inquiry-help">{copy.dateHelp}</p>
      </fieldset>
      <fieldset>
        <legend>{copy.customer}</legend>
        <div className="inquiry-grid">
          {field("name")}
          {field("phone")}
          {field("email", { optional: true })}
        </div>
      </fieldset>
      <div className="inquiry-actions">
        <button type="submit" className="button" disabled={!ready}>
          {copy.check}
        </button>
        <button
          type="button"
          className="button"
          disabled
          aria-describedby="inquiry-unavailable"
        >
          {copy.submit}
        </button>
      </div>
    </form>
  );
}
