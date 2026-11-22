import { minimumApplicantsForTheme } from "../../services/travelProductService";

export type ThemeDetail = {
  id: string;
  name: string;
  title: string;
  description: string;
  introduction: string;
  restriction?: string;
  image: string;
  imagePosition: string;
  mobileImagePosition: string;
  features: [string, string][];
  tourStyles: {
    name: string;
    hotel: string;
    meal: string;
    unavailable: boolean;
  }[];
};

export const themeLinks = [
  { id: "honeymoon", name: "Honeymoon", title: "허니문 낭만 투어", color: "#7c2e3d", href: "/themes/honeymoon" },
  { id: "healing", name: "Healing", title: "효도 힐링 투어", color: "#796329", href: "/themes/healing" },
  { id: "golf", name: "Golf", title: "골프 챌린지 투어", color: "#2d583b", href: "/themes/golf" },
  { id: "trekking", name: "Trekking", title: "아웃도어 트레킹 투어", color: "#33495d", href: "/themes/trekking" },
];

export const honeymoonTheme: ThemeDetail = {
  id: "honeymoon",
  restriction: "이 테마는 그랜드 스타일 이상부터 선택할 수 있어요.",
  name: "Honeymoon",
  title: "허니문 낭만 투어",
  description: "둘만의 시작을 위한 로맨틱 스페셜 룸과 2인 전용 차량",
  introduction: "둘만의 시작을 특별하게. 로맨틱하게 꾸민 스페셜 룸과 2인 전용 고급 차량으로 오롯이 두 사람에게 집중하는 여행입니다.",
  image: "/images/honeymoon.jpg",
  imagePosition: "center 60%",
  mobileImagePosition: "43% center",
  features: [
    ["테마 연출", "로맨틱 스페셜 룸 데코레이션"],
    ["교통", "2인 전용 고급차량"],
    ["기념품", "커플 기념티"],
    ["출발 조건", `${minimumApplicantsForTheme("HONEYMOON")}명 이상 신청 시 출발 확정 · 문자 안내`],
  ],
  tourStyles: [
    { name: "클래식", hotel: "3성 호텔", meal: "도시락", unavailable: true },
    { name: "그랜드", hotel: "4성 호텔", meal: "현지식 레스토랑", unavailable: false },
    { name: "프리미엄", hotel: "5성 호텔", meal: "고급 레스토랑 스테이크 & 샴페인", unavailable: false },
  ],
};

export const healingTheme: ThemeDetail = {
  id: "healing",
  restriction: "이 테마는 그랜드 스타일 이상부터 선택할 수 있어요.",
  name: "Healing",
  title: "효도 힐링 투어",
  description: "부모님을 위한 안마·지압 서비스와 건강 인삼 선물",
  introduction: "부모님께 드리는 쉼. 고품격 안마·지압 서비스와 여유로운 일정, 넉넉한 승합 차량으로 편안하게 모십니다.",
  image: "/images/healing.jpg",
  imagePosition: "center",
  mobileImagePosition: "center",
  features: [
    ["테마 연출", "고품격 안마·지압 서비스"],
    ["교통", "10인 승합 고급차량"],
    ["기념품", "건강 인삼"],
    ["출발 조건", `${minimumApplicantsForTheme("HEALING")}명 이상 신청 시 출발 확정 · 문자 안내`],
  ],
  tourStyles: [
    { name: "클래식", hotel: "3성 호텔", meal: "도시락", unavailable: true },
    { name: "그랜드", hotel: "4성 호텔", meal: "현지식 레스토랑", unavailable: false },
    { name: "프리미엄", hotel: "5성 호텔", meal: "고급 레스토랑 스테이크 & 샴페인", unavailable: false },
  ],
};

export const golfTheme: ThemeDetail = {
  id: "golf",
  name: "Golf",
  title: "골프 챌린지 투어",
  description: "유명 골프 리조트에서 즐기는 라운딩 챌린지",
  introduction: "유명 골프 리조트에서 즐기는 라운딩 챌린지. 동반자와 함께 코스를 누비고 저녁에는 여유롭게 쉬어 가세요.",
  image: "/images/golf.jpg",
  imagePosition: "center",
  mobileImagePosition: "center",
  features: [
    ["테마 연출", "유명 골프 리조트 테마 연출"],
    ["교통", "10인 승합 고급차량"],
    ["기념품", "골프 액세서리(골프공)"],
    ["출발 조건", `${minimumApplicantsForTheme("GOLF")}명 이상 신청 시 출발 확정 · 문자 안내`],
  ],
  tourStyles: [
    { name: "클래식", hotel: "3성 호텔", meal: "도시락", unavailable: false },
    { name: "그랜드", hotel: "4성 호텔", meal: "현지식 레스토랑", unavailable: false },
    { name: "프리미엄", hotel: "5성 호텔", meal: "고급 레스토랑 스테이크 & 샴페인", unavailable: false },
  ],
};

export const trekkingTheme: ThemeDetail = {
  id: "trekking",
  name: "Trekking",
  title: "아웃도어 트레킹 투어",
  description: "산과 길을 걷는 아웃도어 어드벤처",
  introduction: "산과 길을 걷는 아웃도어 어드벤처. 트레킹 코스와 산악 체험을 중심으로 자연 속에서 몸과 마음을 채웁니다.",
  image: "/images/trekking.jpg",
  imagePosition: "center",
  mobileImagePosition: "center",
  features: [
    ["테마 연출", "트레킹·산악 어드벤처 연출"],
    ["교통", "10인 승합 고급차량"],
    ["기념품", "아웃도어 기념품(스카프)"],
    ["출발 조건", `${minimumApplicantsForTheme("TREKKING")}명 이상 신청 시 출발 확정 · 문자 안내`],
  ],
  tourStyles: [
    { name: "클래식", hotel: "3성 호텔", meal: "도시락", unavailable: false },
    { name: "그랜드", hotel: "4성 호텔", meal: "현지식 레스토랑", unavailable: false },
    { name: "프리미엄", hotel: "5성 호텔", meal: "고급 레스토랑 스테이크 & 샴페인", unavailable: false },
  ],
};
