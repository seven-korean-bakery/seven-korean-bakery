import assert from "node:assert/strict";
import test from "node:test";
import {
  emptyInquiry,
  updateInquiry,
  validateInquiry,
  parseInquiry,
  activeInquiryFields,
} from "../src/lib/order-inquiry.ts";
const today = "2026-10-26";
const common = {
  ...emptyInquiry(),
  name: " 홍길동 ",
  phone: "+1 (604) 555-0123",
  date: today,
  allergies: "no",
};
const event = {
  ...common,
  purpose: "event",
  eventType: "baekil",
  eventCount: "30",
  eventCountUnit: "guests",
};
const everyday = {
  ...common,
  purpose: "everyday",
  everydayDetails: "떡 2팩, 덜 달게 부탁드려요",
};
const favors = {
  ...common,
  purpose: "favors",
  quantity: "40",
  budget: "8-10",
  lidPrinting: "no",
};

test("each purpose validates without irrelevant fields or optional contact fields", () => {
  for (const values of [event, everyday, favors])
    assert.deepEqual(validateInquiry(values, today), {});
});
test("purpose, contact, date and allergy answer are required", () => {
  const errors = validateInquiry(emptyInquiry(), today);
  for (const field of ["purpose", "name", "phone", "date", "allergies"])
    assert.equal(errors[field], "requiredError");
  assert.equal(
    validateInquiry({ ...everyday, name: "  " }, today).name,
    "requiredError",
  );
});
test("event requires type, count and count unit; Other requires a description", () => {
  for (const field of ["eventType", "eventCount", "eventCountUnit"])
    assert.equal(
      validateInquiry({ ...event, [field]: "" }, today)[field],
      "requiredError",
    );
  assert.equal(
    validateInquiry({ ...event, eventType: "other" }, today).eventOther,
    "requiredError",
  );
  assert.deepEqual(
    validateInquiry(
      { ...event, eventType: "other", eventOther: "Graduation" },
      today,
    ),
    {},
  );
});
test("everyday description is required but never an event or quantity field", () => {
  assert.equal(
    validateInquiry({ ...everyday, everydayDetails: " " }, today)
      .everydayDetails,
    "requiredError",
  );
  assert.equal(activeInquiryFields(everyday).includes("eventType"), false);
});
test("favors require quantity, one of the five budgets and a printing answer", () => {
  for (const field of ["quantity", "budget", "lidPrinting"])
    assert.equal(
      validateInquiry({ ...favors, [field]: "" }, today)[field],
      "requiredError",
    );
  for (const budget of ["8-10", "10-15", "15-20", "20+", "consultation"])
    assert.deepEqual(validateInquiry({ ...favors, budget }, today), {});
  assert.equal(
    validateInquiry({ ...favors, lidPrinting: "yes" }, today).printedMessage,
    "requiredError",
  );
  assert.deepEqual(
    validateInquiry(
      { ...favors, lidPrinting: "yes", printedMessage: "Thank you" },
      today,
    ),
    {},
  );
});
test("allergy yes and unsure require details; none excludes them", () => {
  for (const allergies of ["yes", "unsure"]) {
    assert.equal(
      validateInquiry({ ...everyday, allergies }, today).allergyDetails,
      "requiredError",
    );
    assert.deepEqual(
      validateInquiry(
        { ...everyday, allergies, allergyDetails: "Please discuss nuts" },
        today,
      ),
      {},
    );
  }
  assert.equal(
    updateInquiry(
      { ...everyday, allergies: "yes", allergyDetails: "Nuts" },
      "allergies",
      "no",
    ).allergyDetails,
    "",
  );
});
test("switching every pair of purposes clears irrelevant answers and preserves common fields", () => {
  const samples = [
    {
      ...event,
      eventType: "other",
      eventOther: "Graduation",
      products: "Rice cakes",
    },
    everyday,
    { ...favors, lidPrinting: "yes", printedMessage: "Thanks" },
  ];
  for (const from of samples)
    for (const to of ["event", "everyday", "favors"]) {
      if (from.purpose === to) continue;
      const switched = updateInquiry(from, "purpose", to);
      for (const field of ["name", "phone", "date", "allergies"])
        assert.equal(switched[field], from[field]);
      for (const field of [
        "eventType",
        "eventOther",
        "eventCount",
        "products",
        "everydayDetails",
        "quantity",
        "budget",
        "lidPrinting",
        "printedMessage",
      ])
        assert.equal(switched[field], "");
    }
});
test("switching Other and lid printing clears dependent text without resetting common data", () => {
  assert.equal(
    updateInquiry(
      { ...event, eventType: "other", eventOther: "Private" },
      "eventType",
      "birthday",
    ).eventOther,
    "",
  );
  for (const choice of ["no", "unsure"])
    assert.equal(
      updateInquiry(
        { ...favors, lidPrinting: "yes", printedMessage: "Private" },
        "lidPrinting",
        choice,
      ).printedMessage,
      "",
    );
});
test("normalized payload strips stale conditional data even if draft is tampered with", () => {
  const parsed = parseInquiry(
    {
      ...everyday,
      eventType: "other",
      eventOther: "stale",
      quantity: "bad",
      printedMessage: "stale",
      allergyDetails: "stale",
    },
    today,
  );
  assert.equal(parsed.success, true);
  assert.deepEqual(parsed.data, {
    name: "홍길동",
    phone: common.phone,
    email: "",
    date: today,
    time: "",
    requests: "",
    allergy: { status: "no" },
    purpose: "everyday",
    details: everyday.everydayDetails,
  });
  const gift = parseInquiry(
    { ...favors, lidPrinting: "yes", printedMessage: " Thank you " },
    today,
  );
  assert.equal(gift.data.quantity, 40);
  assert.equal(gift.data.currency, "CAD");
  assert.deepEqual(gift.data.printing, { choice: "yes", message: "Thank you" });
  const other = parseInquiry(
    { ...event, eventType: "other", eventOther: "Graduation" },
    today,
  );
  assert.deepEqual(other.data.event, {
    type: "other",
    description: "Graduation",
  });
});
test("unknown enum values are rejected rather than silently accepted", () => {
  for (const [values, field] of [
    [everyday, "purpose"],
    [everyday, "allergies"],
    [event, "eventType"],
    [event, "eventCountUnit"],
    [favors, "budget"],
    [favors, "lidPrinting"],
  ])
    assert.equal(
      validateInquiry({ ...values, [field]: "invalid" }, today)[field],
      "requiredError",
    );
  assert.equal(parseInquiry(emptyInquiry(), today).success, false);
});
test("counts are positive safe integers; email and phone are validated", () => {
  for (const value of ["0", "-1", "1.5", "1e3", "9007199254740992"]) {
    assert.equal(
      validateInquiry({ ...event, eventCount: value }, today).eventCount,
      "quantityError",
    );
    assert.equal(
      validateInquiry({ ...favors, quantity: value }, today).quantity,
      "quantityError",
    );
  }
  for (const phone of ["abcdefghi", "---()---", "123456", "1234567890123456"])
    assert.equal(
      validateInquiry({ ...everyday, phone }, today).phone,
      "phoneError",
    );
  assert.equal(
    validateInquiry({ ...everyday, email: "invalid" }, today).email,
    "emailError",
  );
  assert.deepEqual(
    validateInquiry({ ...everyday, email: "guest@example.com" }, today),
    {},
  );
});
test("dates reject past and impossible dates; optional time is validated", () => {
  for (const date of ["2026-10-25", "2027-02-29", "2027-13-01", "not-a-date"])
    assert.equal(
      validateInquiry({ ...everyday, date }, today).date,
      "dateError",
    );
  assert.deepEqual(
    validateInquiry({ ...everyday, date: "2028-02-29", time: "09:30" }, today),
    {},
  );
  assert.equal(
    validateInquiry({ ...everyday, time: "25:00" }, today).time,
    "timeError",
  );
});
test("free text is bounded only for active fields", () => {
  assert.equal(
    validateInquiry({ ...everyday, everydayDetails: "a".repeat(2001) }, today)
      .everydayDetails,
    "lengthError",
  );
  assert.equal(
    validateInquiry({ ...event, products: "a".repeat(255) }, today).products,
    "lengthError",
  );
  assert.deepEqual(
    validateInquiry({ ...everyday, printedMessage: "a".repeat(3000) }, today),
    {},
  );
});
