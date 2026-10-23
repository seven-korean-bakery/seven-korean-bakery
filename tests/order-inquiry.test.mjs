import assert from "node:assert/strict";
import test from "node:test";
import { validateInquiry, inquiryFields } from "../src/lib/order-inquiry.ts";
const valid = {
  name: "홍길동",
  phone: "+1 (604) 555-0123",
  email: "",
  product: "Rice cakes",
  quantity: "2",
  date: "2026-10-22",
  time: "",
  occasion: "Birthday",
  requests: "",
};
const today = "2026-10-22";
test("optional fields may be empty; Unicode customer names are valid", () =>
  assert.deepEqual(validateInquiry(valid, today), {}));
test("all required fields reject whitespace", () => {
  const errors = validateInquiry(
    Object.fromEntries(inquiryFields.map((f) => [f, ""])),
    today,
  );
  assert.deepEqual(Object.keys(errors), [
    "name",
    "phone",
    "product",
    "quantity",
    "date",
    "occasion",
  ]);
  assert.equal(
    validateInquiry({ ...valid, name: "  " }, today).name,
    "requiredError",
  );
});
test("phone, optional email and time are checked when provided", () => {
  for (const phone of ["abcdefghi", "---()---", "123456", "1234567890123456"])
    assert.equal(
      validateInquiry({ ...valid, phone }, today).phone,
      "phoneError",
    );
  assert.equal(
    validateInquiry({ ...valid, email: "invalid" }, today).email,
    "emailError",
  );
  assert.equal(
    validateInquiry({ ...valid, time: "25:00" }, today).time,
    "timeError",
  );
  assert.deepEqual(
    validateInquiry(
      { ...valid, email: "guest@example.com", time: "09:30" },
      today,
    ),
    {},
  );
});
test("quantity must be a safe positive integer", () => {
  for (const quantity of ["0", "-1", "1.5", "1e3", "9007199254740992"])
    assert.equal(
      validateInquiry({ ...valid, quantity }, today).quantity,
      "quantityError",
    );
});
test("dates reject past dates and calendar rollovers", () => {
  for (const date of ["2026-10-21", "2027-02-29", "2027-13-01", "not-a-date"])
    assert.equal(validateInquiry({ ...valid, date }, today).date, "dateError");
  assert.deepEqual(
    validateInquiry({ ...valid, date: "2028-02-29" }, today),
    {},
  );
});
test("free text is bounded", () =>
  assert.equal(
    validateInquiry({ ...valid, requests: "a".repeat(2001) }, today).requests,
    "lengthError",
  ));
