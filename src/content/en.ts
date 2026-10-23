import type ko from "./ko";

const en: typeof ko = {
  orderInquiry: {
    title: "Custom Order Inquiry",
    intro: "Tell us what you have in mind for your next gathering.",
    notice:
      "An inquiry is not a confirmed order. Bakery staff will contact you by phone to discuss availability, pricing, and pickup before confirming your order.",
    unavailable:
      "Online submissions are not yet available. This form is a preview only: nothing is sent or saved. Please call the bakery to make an inquiry.",
    contact: "Phone inquiries",
    required: "Fields marked * are required.",
    optional: "(optional)",
    customer: "Your details",
    order: "Order & pickup",
    check: "Check details (does not send)",
    submit: "Submission unavailable",
    valid:
      "Details checked. Nothing has been sent. Online submissions are not yet available; please call the bakery.",
    summary: "Please correct the following fields.",
    name: "Customer name",
    phone: "Phone number",
    email: "Email",
    product: "Product / order type",
    quantity: "Quantity",
    date: "Preferred pickup date",
    time: "Preferred pickup time",
    occasion: "Occasion",
    requests: "Special requests",
    productHelp: "Describe the rice cakes or type of order you have in mind.",
    quantityHelp:
      "Enter a whole number. Describe the units (pieces, boxes, etc.) in special requests.",
    dateHelp:
      "Choose today or a future date in Vancouver. Availability will be confirmed by phone.",
    requestsHelp:
      "Include quantities by product, preferences, or questions. Please do not include sensitive personal information.",
    requiredError: "Please complete this field.",
    phoneError: "Enter a valid phone number with 7–15 digits.",
    emailError: "Enter a valid email address.",
    quantityError: "Enter a whole number greater than zero.",
    dateError: "Choose a valid date today or later in Vancouver.",
    timeError: "Enter a valid pickup time.",
    lengthError: "This entry is too long. Please shorten it.",
  },
  siteTitle: "7 Korean Bakery",
  metadataDescription:
    "7 Korean Bakery in Coquitlam prepares Korean rice cakes for celebrations, gifts, and family gatherings.",
  skipToContent: "Skip to content",
  nav: {
    home: "Home",
    order: "Custom Order",
    products: "Find Our Products",
    gallery: "Gallery",
    request: "Request an Order",
    language: "Choose language",
    switchToEnglish: "EN",
    switchToKorean: "KR",
    englishLanguageName: "English",
    koreanLanguageName: "Korean",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    eyebrow: "Korean Rice Cake Bakery · Coquitlam, BC",
    title: "Korean rice cakes for meaningful moments.",
    secondaryTitle: "소중한 순간을 위한 정성스러운 우리 떡",
    intro:
      "7 Korean Bakery prepares Korean rice cakes for celebrations, gifts, and family gatherings in Coquitlam, BC.",
    secondaryIntro:
      "일곱시 떡집은 코퀴틀람에서 기념일, 선물, 가족 모임을 위한 한국 전통 떡을 정성껏 준비합니다.",
    request: "Request an Order",
    gallery: "View Gallery",
  },
  introduction: {
    eyebrow: "A little about us",
    title: "Made for celebrations, gifts, and gatherings",
    secondaryTitle: "기념일과 모임을 위해 정성껏 준비합니다",
    body: "From birthdays, baek-il, and dol celebrations to weddings, gifts, family gatherings, and community events, we prepare rice cakes to share at meaningful moments.",
    secondaryBody:
      "생일과 백일, 돌잔치와 결혼식부터 선물, 가족 모임과 지역 행사까지. 소중한 순간을 나누는 자리에 함께할 떡을 준비합니다.",
  },
  ordering: {
    eyebrow: "A simple process",
    title: "How ordering works",
    secondaryTitle: "주문은 이렇게 진행됩니다",
    intro: "Start with an order request or ask us for a consultation.",
    secondaryIntro: "주문 요청 또는 상담 문의 중 편한 방법으로 시작해 주세요.",
    steps: [
      {
        title: "Send a request",
        secondaryTitle: "주문 요청",
        body: "Tell us what you would like and your preferred collection date.",
        secondaryBody: "원하시는 내용과 희망 픽업 날짜를 알려 주세요.",
      },
      {
        title: "Hear from us",
        secondaryTitle: "상담 및 확인",
        body: "We review availability, details, and pricing.",
        secondaryBody: "가능 여부와 자세한 내용, 가격을 확인합니다.",
      },
      {
        title: "Confirm your order",
        secondaryTitle: "주문 확정",
        body: "We confirm the order and collection details with you.",
        secondaryBody: "주문과 픽업 정보를 함께 확인합니다.",
      },
    ],
    notice:
      "Submitting a request does not automatically confirm an order. Ask for a consultation if you need help choosing.",
    secondaryNotice:
      "요청을 보내주셔도 주문이 자동으로 확정되지는 않습니다. 메뉴 선택이 어려우시면 상담을 요청해 주세요.",
  },
  occasions: {
    eyebrow: "Made for sharing",
    title: "For life's meaningful moments",
    secondaryTitle: "모든 특별한 날에",
    items: [
      { en: "Birthday", ko: "생일" },
      { en: "Baek-il", ko: "백일" },
      { en: "Dol", ko: "돌" },
      { en: "Wedding", ko: "결혼식" },
      { en: "Family gathering", ko: "가족 모임" },
      { en: "Corporate or community event", ko: "회사·지역 행사" },
      { en: "Gifts", ko: "선물" },
      { en: "Other special occasions", ko: "그 밖의 특별한 날" },
    ],
  },
  store: {
    eyebrow: "Come visit",
    title: "Store & hours",
    secondaryTitle: "매장 및 영업시간",
    today: "Today",
    hoursTitle: "Hours",
    notice: "Holiday hours may vary. Please contact us before visiting.",
    secondaryNotice:
      "공휴일에는 영업시간이 변경될 수 있으니 방문 전 확인해 주세요.",
    link: "Store Hours & Locations",
    secondaryLink: "영업시간 및 판매처",
    mapLink: "View map",
  },
  gallery: {
    eyebrow: "A few moments",
    title: "A little look around",
    secondaryTitle: "갤러리",
    imageLabel: "Gallery Image",
    comingSoon: "Photo coming soon",
    secondaryComingSoon: "사진 준비 중",
    link: "View Gallery",
    secondaryLink: "갤러리 보기",
  },
  invitation: {
    eyebrow: "Let's make it meaningful",
    title: "Planning a special occasion?",
    secondaryTitle: "특별한 날을 준비하고 계신가요?",
    button: "Start Your Order Request",
    secondaryButton: "주문 문의 시작하기",
  },
  footer: {
    addressLabel: "Address",
    contactLabel: "Contact",
    navigation: "Explore",
    privacy: "Privacy notice",
    rights: "All rights reserved.",
    backToTop: "Back to top",
  },
};

export default en;
