"use client";

import { useRef, useState } from "react";
import { getContent } from "@/content";
import type { Locale } from "@/lib/locales";
import { business } from "@/lib/business";
import {
  inquiryFields,
  validateInquiry,
  type InquiryField,
  type InquiryValues,
  type InquiryErrors,
} from "@/lib/order-inquiry";

export function OrderInquiryForm({ locale }: { locale: Locale }) {
  const copy = getContent(locale).orderInquiry;
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [checked, setChecked] = useState(false);
  const summary = useRef<HTMLDivElement>(null);
  const fields = (names: readonly InquiryField[]) =>
    names.map((name) => {
      const optional = ["email", "time", "requests"].includes(name);
      const help =
        name === "product"
          ? copy.productHelp
          : name === "quantity"
            ? copy.quantityHelp
            : name === "date"
              ? copy.dateHelp
              : name === "requests"
                ? copy.requestsHelp
                : undefined;
      const props = {
        id: name,
        name,
        required: !optional,
        "aria-invalid": !!errors[name],
        "aria-describedby":
          [help && `${name}-help`, errors[name] && `${name}-error`]
            .filter(Boolean)
            .join(" ") || undefined,
      };
      return (
        <div
          className={`inquiry-field ${name === "requests" ? "inquiry-wide" : ""}`}
          key={name}
        >
          <label htmlFor={name}>
            {copy[name]}{" "}
            {optional ? (
              <span>{copy.optional}</span>
            ) : (
              <span aria-hidden="true">*</span>
            )}
          </label>
          {name === "requests" ? (
            <textarea {...props} rows={5} maxLength={2000} />
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
              inputMode={name === "quantity" ? "numeric" : undefined}
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
          {errors[name] && (
            <p id={`${name}-error`} className="inquiry-error">
              {copy[errors[name]]}
            </p>
          )}
        </div>
      );
    });
  return (
    <form
      noValidate
      aria-describedby="inquiry-unavailable"
      onChange={() => setChecked(false)}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const values = Object.fromEntries(
          inquiryFields.map((field) => [field, String(data.get(field) ?? "")]),
        ) as InquiryValues;
        const today = new Intl.DateTimeFormat("en-CA", {
          timeZone: business.timeZone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date());
        setErrors(validateInquiry(values, today));
        setChecked(true);
        requestAnimationFrame(() => summary.current?.focus());
      }}
    >
      <p>{copy.required}</p>
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
                {inquiryFields
                  .filter((field) => errors[field])
                  .map((field) => (
                    <li key={field}>
                      <a href={`#${field}`}>
                        {copy[field]}: {copy[errors[field]!]}
                      </a>
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <p>{copy.valid}</p>
          ))}
      </div>
      <fieldset>
        <legend>{copy.customer}</legend>
        <div className="inquiry-grid">{fields(["name", "phone", "email"])}</div>
      </fieldset>
      <fieldset>
        <legend>{copy.order}</legend>
        <div className="inquiry-grid">
          {fields([
            "product",
            "quantity",
            "date",
            "time",
            "occasion",
            "requests",
          ])}
        </div>
      </fieldset>
      <div className="inquiry-actions">
        <button type="submit" className="button">
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
