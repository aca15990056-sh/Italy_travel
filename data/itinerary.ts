export type Spot = {
  id: string;
  name: string;
  city: string;
  country: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  category?: "arrival" | "hotel" | "sight" | "food" | "transfer" | "activity";
  timeBlock?: string;
  note?: string;
  content?: {
    summary?: string;
    history?: string;
    highlights?: string[];
    tips?: string[];
  };
};

export type DayPlan = {
  day: number;
  date: string;
  title: string;
  summaryLine?: string;
  heroImage?: string;
  motionLabel?: string;
  baseCity: string;
  moveModeDefault: "TRANSIT" | "DRIVING" | "WALKING";
  spots: Spot[];
};

export const itinerary: DayPlan[] = [
  {
    day: 1,
    date: "2026-10-01",
    title: "로마 In · 체크인 & 저녁 산책",
    summaryLine: "공항 도착 → 시내 이동 → 숙소 체크인 & 가벼운 산책",
    heroImage:
      "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=1600&q=80",
    motionLabel: "DAY1: 공항 도착 후 짐을 끌고 시내로 이동",
    baseCity: "Rome",
    moveModeDefault: "TRANSIT",
    spots: [
      {
        id: "day1-fco",
        name: "Leonardo da Vinci–Fiumicino Airport (FCO)",
        city: "Rome",
        country: "Italy",
        lat: 41.8003,
        lng: 12.2389,
        category: "arrival",
        timeBlock: "PM",
        note: "로마 입국",
        content: {
          summary: "로마 주요 국제공항. 테르미니까지 레오나르도 익스프레스 32분."
        }
      },
      {
        id: "day1-termini",
        name: "Roma Termini",
        city: "Rome",
        country: "Italy",
        lat: 41.901,
        lng: 12.5018,
        category: "transfer",
        timeBlock: "PM",
        content: {
          summary: "로마 교통 중심역."
        }
      },
      {
        id: "day1-rome-hotel",
        name: "Centro Storico Hotel Area",
        city: "Rome",
        country: "Italy",
        lat: 41.9028,
        lng: 12.4964,
        category: "hotel",
        timeBlock: "Evening",
        content: {
          summary: "시내 중심 숙소 체크인."
        }
      }
    ]
  },
  {
    day: 2,
    date: "2026-10-02",
    title: "로마 시내 핵심 투어",
    summaryLine: "콜로세움 · 포로 로마노 · 판테온 집중",
    heroImage:
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1600&q=80",
    motionLabel: "DAY2: 로마 핵심 유적을 도보로 둘러보기",
    baseCity: "Rome",
    moveModeDefault: "WALKING",
    spots: [
      {
        id: "day2-colosseum",
        name: "Colosseum",
        city: "Rome",
        country: "Italy",
        lat: 41.8902,
        lng: 12.4922,
        category: "sight",
        timeBlock: "AM",
        content: {
          summary: "로마 상징 원형 경기장."
        }
      },
      {
        id: "day2-forum",
        name: "Roman Forum",
        city: "Rome",
        country: "Italy",
        lat: 41.8925,
        lng: 12.4853,
        category: "sight",
        timeBlock: "PM",
        content: {
          summary: "고대 로마 정치·종교 중심지."
        }
      },
      {
        id: "day2-pantheon",
        name: "Pantheon",
        city: "Rome",
        country: "Italy",
        lat: 41.8986,
        lng: 12.4769,
        category: "sight",
        timeBlock: "Evening",
        content: {
          summary: "돔 천장 채광이 인상적인 건축물."
        }
      }
    ]
  },
  {
    day: 3,
    date: "2026-10-03",
    title: "남부 1일 투어 (폼페이)",
    summaryLine: "로마 → 나폴리 → 폼페이 유적지",
    heroImage:
      "https://images.unsplash.com/photo-1543425820-8e11424682dd?auto=format&fit=crop&w=1600&q=80",
    motionLabel: "DAY3: 남부로 내려가 폼페이 유적을 만나는 날",
    baseCity: "Rome",
    moveModeDefault: "TRANSIT",
    spots: [
      {
        id: "day3-termini",
        name: "Roma Termini",
        city: "Rome",
        country: "Italy",
        lat: 41.901,
        lng: 12.5018,
        category: "transfer",
        timeBlock: "AM"
      },
      {
        id: "day3-naples",
        name: "Naples City Center",
        city: "Naples",
        country: "Italy",
        lat: 40.8359,
        lng: 14.2488,
        category: "sight",
        timeBlock: "PM",
        content: {
          summary: "나폴리 중심 산책."
        }
      },
      {
        id: "day3-pompeii",
        name: "Pompeii Archaeological Park",
        city: "Pompeii",
        country: "Italy",
        lat: 40.7497,
        lng: 14.484,
        category: "activity",
        timeBlock: "PM",
        content: {
          summary: "베수비오 화산으로 보존된 고대 도시."
        }
      }
    ]
  },
  {
    day: 4,
    date: "2026-10-04",
    title: "로마 → 피렌체 이동",
    summaryLine: "고속열차 이동 후 피렌체 체크인",
    heroImage:
      "https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?auto=format&fit=crop&w=1600&q=80",
    motionLabel: "DAY4: 로마에서 피렌체로 이동하는 날",
    baseCity: "Florence",
    moveModeDefault: "TRANSIT",
    spots: [
      {
        id: "day4-termini",
        name: "Roma Termini",
        city: "Rome",
        country: "Italy",
        lat: 41.901,
        lng: 12.5018,
        category: "transfer",
        timeBlock: "AM"
      },
      {
        id: "day4-firenze-smn",
        name: "Firenze S. M. Novella",
        city: "Florence",
        country: "Italy",
        lat: 43.776,
        lng: 11.247,
        category: "transfer",
        timeBlock: "PM"
      },
      {
        id: "day4-florence-hotel",
        name: "Duomo Area Hotel",
        city: "Florence",
        country: "Italy",
        lat: 43.7731,
        lng: 11.255,
        category: "hotel",
        timeBlock: "Evening",
        content: {
          summary: "두오모 주변 숙소 체크인."
        }
      }
    ]
  },
  {
    day: 5,
    date: "2026-10-05",
    title: "피렌체 시내",
    summaryLine: "두오모 · 우피치 · 베키오 다리",
    heroImage:
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1600&q=80",
    motionLabel: "DAY5: 피렌체의 예술과 강변 산책",
    baseCity: "Florence",
    moveModeDefault: "WALKING",
    spots: [
      {
        id: "day5-duomo-firenze",
        name: "Duomo Firenze",
        city: "Florence",
        country: "Italy",
        lat: 43.7731,
        lng: 11.255,
        category: "sight",
        timeBlock: "AM",
        content: {
          summary: "피렌체 상징 돔과 광장."
        }
      },
      {
        id: "day5-uffizi",
        name: "Uffizi Gallery",
        city: "Florence",
        country: "Italy",
        lat: 43.7687,
        lng: 11.255,
        category: "activity",
        timeBlock: "PM",
        content: {
          summary: "르네상스 대표 미술관."
        }
      },
      {
        id: "day5-ponte-vecchio",
        name: "Ponte Vecchio",
        city: "Florence",
        country: "Italy",
        lat: 43.7679,
        lng: 11.2531,
        category: "sight",
        timeBlock: "Evening",
        content: {
          summary: "아르노 강변 산책 포인트."
        }
      }
    ]
  },
  {
    day: 6,
    date: "2026-10-06",
    title: "피렌체 → 밀라노 → 스위스",
    summaryLine: "밀라노 환승 후 인터라켄 이동",
    heroImage:
      "https://images.unsplash.com/photo-1446160657592-4782fb76fb99?auto=format&fit=crop&w=1600&q=80",
    motionLabel: "DAY6: 이탈리아에서 스위스로 넘어가는 날",
    baseCity: "Interlaken",
    moveModeDefault: "TRANSIT",
    spots: [
      {
        id: "day6-firenze-smn",
        name: "Firenze S. M. Novella",
        city: "Florence",
        country: "Italy",
        lat: 43.776,
        lng: 11.247,
        category: "transfer",
        timeBlock: "AM"
      },
      {
        id: "day6-milano-centrale",
        name: "Milano Centrale",
        city: "Milan",
        country: "Italy",
        lat: 45.4853,
        lng: 9.2045,
        category: "transfer",
        timeBlock: "PM"
      },
      {
        id: "day6-interlaken-ost",
        name: "Interlaken Ost",
        city: "Interlaken",
        country: "Switzerland",
        lat: 46.6885,
        lng: 7.858,
        category: "transfer",
        timeBlock: "Evening",
        content: {
          summary: "알프스 관문 도시 도착."
        }
      }
    ]
  },
  {
    day: 7,
    date: "2026-10-07",
    title: "스위스 인터라켄",
    summaryLine: "호수 산책 · 호에마테 · 전망 포인트",
    heroImage:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
    motionLabel: "DAY7: 알프스 배경의 인터라켄을 즐기기",
    baseCity: "Interlaken",
    moveModeDefault: "WALKING",
    spots: [
      {
        id: "day7-hohematte",
        name: "Höhematte Park",
        city: "Interlaken",
        country: "Switzerland",
        lat: 46.6863,
        lng: 7.8632,
        category: "sight",
        timeBlock: "AM",
        content: {
          summary: "인터라켄 중심 잔디광장."
        }
      },
      {
        id: "day7-brienz",
        name: "Lake Brienz",
        city: "Interlaken",
        country: "Switzerland",
        lat: 46.7307,
        lng: 7.9425,
        category: "sight",
        timeBlock: "PM",
        content: {
          summary: "청록빛 호수 산책."
        }
      },
      {
        id: "day7-harder",
        name: "Harder Kulm Viewpoint",
        city: "Interlaken",
        country: "Switzerland",
        lat: 46.6969,
        lng: 7.8506,
        category: "activity",
        timeBlock: "Evening",
        content: {
          summary: "인터라켄 전망대."
        }
      }
    ]
  },
  {
    day: 8,
    date: "2026-10-08",
    title: "인터라켄 → 밀라노 복귀",
    summaryLine: "알프스 마무리 후 밀라노 이동",
    heroImage:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
    motionLabel: "DAY8: 스위스를 떠나 밀라노로 복귀",
    baseCity: "Milan",
    moveModeDefault: "TRANSIT",
    spots: [
      {
        id: "day8-interlaken-ost",
        name: "Interlaken Ost",
        city: "Interlaken",
        country: "Switzerland",
        lat: 46.6885,
        lng: 7.858,
        category: "transfer",
        timeBlock: "AM"
      },
      {
        id: "day8-milano-centrale",
        name: "Milano Centrale",
        city: "Milan",
        country: "Italy",
        lat: 45.4853,
        lng: 9.2045,
        category: "transfer",
        timeBlock: "PM"
      },
      {
        id: "day8-navigli",
        name: "Navigli",
        city: "Milan",
        country: "Italy",
        lat: 45.4524,
        lng: 9.17,
        category: "sight",
        timeBlock: "Evening",
        content: {
          summary: "운하 야경과 아페리티보."
        }
      }
    ]
  },
  {
    day: 9,
    date: "2026-10-09",
    title: "베네치아",
    summaryLine: "밀라노 출발 → 산마르코 · 리알토",
    heroImage:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
    motionLabel: "DAY9: 물길 위 도시에서 하루를 보내기",
    baseCity: "Venice",
    moveModeDefault: "WALKING",
    spots: [
      {
        id: "day9-milano-centrale",
        name: "Milano Centrale",
        city: "Milan",
        country: "Italy",
        lat: 45.4853,
        lng: 9.2045,
        category: "transfer",
        timeBlock: "AM",
        content: {
          summary: "베네치아 이동 출발역."
        }
      },
      {
        id: "day9-venezia-sl",
        name: "Venezia Santa Lucia",
        city: "Venice",
        country: "Italy",
        lat: 45.4412,
        lng: 12.3216,
        category: "transfer",
        timeBlock: "AM"
      },
      {
        id: "day9-st-marks",
        name: "St. Mark's Square",
        city: "Venice",
        country: "Italy",
        lat: 45.4342,
        lng: 12.3387,
        category: "sight",
        timeBlock: "PM",
        content: {
          summary: "베네치아 중심 광장."
        }
      },
      {
        id: "day9-rialto",
        name: "Rialto Bridge",
        city: "Venice",
        country: "Italy",
        lat: 45.438,
        lng: 12.3358,
        category: "sight",
        timeBlock: "Evening",
        content: {
          summary: "대운하 대표 뷰포인트."
        }
      }
    ]
  },
  {
    day: 10,
    date: "2026-10-10",
    title: "베네치아 → 밀라노 복귀",
    summaryLine: "베네치아 체크아웃 후 밀라노 복귀",
    heroImage:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&q=80",
    motionLabel: "DAY10: 수로 도시를 떠나 밀라노로 이동",
    baseCity: "Milan",
    moveModeDefault: "TRANSIT",
    spots: [
      {
        id: "day10-venezia-sl",
        name: "Venezia Santa Lucia",
        city: "Venice",
        country: "Italy",
        lat: 45.4412,
        lng: 12.3216,
        category: "transfer",
        timeBlock: "AM"
      },
      {
        id: "day10-milano-centrale",
        name: "Milano Centrale",
        city: "Milan",
        country: "Italy",
        lat: 45.4853,
        lng: 9.2045,
        category: "transfer",
        timeBlock: "PM"
      },
      {
        id: "day10-navigli",
        name: "Navigli",
        city: "Milan",
        country: "Italy",
        lat: 45.4524,
        lng: 9.17,
        category: "sight",
        timeBlock: "Evening",
        content: {
          summary: "복귀 후 저녁 산책."
        }
      }
    ]
  },
  {
    day: 11,
    date: "2026-10-11",
    title: "밀라노 Out",
    summaryLine: "두오모 & 갤러리아 후 공항 이동",
    heroImage:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
    motionLabel: "DAY11: 밀라노 출국 준비",
    baseCity: "Milan",
    moveModeDefault: "TRANSIT",
    spots: [
      {
        id: "day11-duomo-milano",
        name: "Duomo di Milano",
        city: "Milan",
        country: "Italy",
        lat: 45.4642,
        lng: 9.1916,
        category: "sight",
        timeBlock: "AM",
        content: {
          summary: "밀라노 대표 대성당."
        }
      },
      {
        id: "day11-galleria",
        name: "Galleria Vittorio Emanuele II",
        city: "Milan",
        country: "Italy",
        lat: 45.4659,
        lng: 9.1901,
        category: "sight",
        timeBlock: "AM",
        content: {
          summary: "돔 천장 쇼핑 아케이드."
        }
      },
      {
        id: "day11-mxp",
        name: "Milan Malpensa Airport (MXP)",
        city: "Milan",
        country: "Italy",
        lat: 45.6306,
        lng: 8.7281,
        category: "transfer",
        timeBlock: "PM",
        note: "밀라노 출국"
      }
    ]
  }
];
