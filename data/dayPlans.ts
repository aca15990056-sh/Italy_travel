export type TimeFlowItem = {
  label: string;
  caption: string;
};

export type DayPlan = {
  day: number;
  city: string;
  country: string;
  title: string;
  summary: string;
  heroImage?: string;
  heroVideo?: string;
  sideHighlights?: {
    left: { label: string; prominence?: "high" | "normal" }[];
    right: { label: string; prominence?: "high" | "normal" }[];
  };
  tone: {
    from: string;
    to: string;
  };
  silhouette?: "city" | "mountain" | "coast";
  timeline: TimeFlowItem[];
};

export const dayPlans: DayPlan[] = [
  {
    day: 1,
    city: "Rome",
    country: "Italy",
    title: "로마, 첫 장면",
    summary: "공항에서 시내로, 여행이 시작된다",
    heroImage:
      "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=2000&q=80",
    heroVideo: "/videos/day1-rome.mp4",
    sideHighlights: {
      left: [
        { label: "Colosseum", prominence: "high" },
        { label: "Pantheon" }
      ],
      right: [
        { label: "Trevi Fountain" },
        { label: "Spanish Steps", prominence: "high" }
      ]
    },
    tone: { from: "#f97316", to: "#ef4444" },
    silhouette: "city",
    timeline: [
      { label: "Morning", caption: "로마 인" },
      { label: "Afternoon", caption: "체크인" },
      { label: "Evening", caption: "골목 산책" }
    ]
  },
  {
    day: 2,
    city: "Rome",
    country: "Italy",
    title: "고대의 심장",
    summary: "콜로세움과 포로 로마노의 하루",
    heroImage:
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=2000&q=80",
    heroVideo: "/videos/day2-rome.mp4",
    sideHighlights: {
      left: [
        { label: "Colosseum", prominence: "high" },
        { label: "Roman Forum" }
      ],
      right: [
        { label: "Pantheon", prominence: "high" },
        { label: "Piazza Navona" }
      ]
    },
    tone: { from: "#b91c1c", to: "#f97316" },
    silhouette: "city",
    timeline: [
      { label: "Morning", caption: "콜로세움" },
      { label: "Afternoon", caption: "포로 로마노" },
      { label: "Evening", caption: "판테온" }
    ]
  },
  {
    day: 3,
    city: "Pompeii",
    country: "Italy",
    title: "멈춘 도시, 폼페이",
    summary: "고대의 시간 위를 걷는다",
    heroImage:
      "https://images.unsplash.com/photo-1543425820-8e11424682dd?auto=format&fit=crop&w=2000&q=80",
    heroVideo: "/videos/day3-pompeii.mp4",
    sideHighlights: {
      left: [
        { label: "Pompeii Ruins", prominence: "high" },
        { label: "Vesuvius View" }
      ],
      right: [
        { label: "Naples", prominence: "high" },
        { label: "Archaeology" }
      ]
    },
    tone: { from: "#7f1d1d", to: "#f97316" },
    silhouette: "city",
    timeline: [
      { label: "Morning", caption: "로마 출발" },
      { label: "Midday", caption: "폼페이 유적" },
      { label: "Evening", caption: "나폴리 경유" }
    ]
  },
  {
    day: 4,
    city: "Florence",
    country: "Italy",
    title: "르네상스의 도시로",
    summary: "로마에서 피렌체로, 분위기가 바뀐다",
    heroImage:
      "https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?auto=format&fit=crop&w=2000&q=80",
    heroVideo: "/videos/day4-Florence.mp4",
    sideHighlights: {
      left: [
        { label: "Firenze SMN", prominence: "high" },
        { label: "Duomo" }
      ],
      right: [
        { label: "Ponte Vecchio" },
        { label: "Arno River", prominence: "high" }
      ]
    },
    tone: { from: "#f59e0b", to: "#f97316" },
    silhouette: "city",
    timeline: [
      { label: "Morning", caption: "로마 출발" },
      { label: "Afternoon", caption: "피렌체 도착" },
      { label: "Evening", caption: "두오모 야경" }
    ]
  },
  {
    day: 5,
    city: "Florence",
    country: "Italy",
    title: "황금빛 피렌체",
    summary: "두오모와 아르노 강의 하루",
    heroImage:
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=2000&q=80",
    heroVideo: "/videos/day5-Florence.mp4",
    sideHighlights: {
      left: [
        { label: "Duomo", prominence: "high" },
        { label: "Uffizi" }
      ],
      right: [
        { label: "Piazza della Signoria" },
        { label: "Ponte Vecchio", prominence: "high" }
      ]
    },
    tone: { from: "#f59e0b", to: "#fbbf24" },
    silhouette: "city",
    timeline: [
      { label: "Morning", caption: "두오모" },
      { label: "Afternoon", caption: "우피치" },
      { label: "Evening", caption: "베키오 다리" }
    ]
  },
  {
    day: 6,
    city: "Interlaken",
    country: "Switzerland",
    title: "알프스로 넘어가다",
    summary: "피렌체에서 스위스로, 풍경이 열리다",
    heroImage:
      "https://images.unsplash.com/photo-1446160657592-4782fb76fb99?auto=format&fit=crop&w=2000&q=80",
    heroVideo: "/videos/day6-interlaken.mp4",
    sideHighlights: {
      left: [
        { label: "Milano Centrale", prominence: "high" },
        { label: "Alps Crossing" }
      ],
      right: [
        { label: "Interlaken", prominence: "high" },
        { label: "Lake Thun" }
      ]
    },
    tone: { from: "#0ea5e9", to: "#6366f1" },
    silhouette: "mountain",
    timeline: [
      { label: "Morning", caption: "피렌체 출발" },
      { label: "Afternoon", caption: "밀라노 환승" },
      { label: "Evening", caption: "인터라켄 도착" }
    ]
  },
  {
    day: 7,
    city: "Interlaken",
    country: "Switzerland",
    title: "알프스가 배경이 되다",
    summary: "호수와 산이 하루를 채운다",
    heroImage:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80",
    heroVideo: "/videos/day7-interlaken.mp4",
    sideHighlights: {
      left: [
        { label: "Höhematte", prominence: "high" },
        { label: "Lake Brienz" }
      ],
      right: [
        { label: "Harder Kulm", prominence: "high" },
        { label: "Alpine View" }
      ]
    },
    tone: { from: "#38bdf8", to: "#22c55e" },
    silhouette: "mountain",
    timeline: [
      { label: "Morning", caption: "호에마테" },
      { label: "Afternoon", caption: "브리엔츠 호수" },
      { label: "Evening", caption: "전망대" }
    ]
  },
  {
    day: 8,
    city: "Milan",
    country: "Italy",
    title: "도시로 복귀",
    summary: "알프스를 떠나 밀라노로 돌아온다",
    heroImage:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80",
    heroVideo: "/videos/day8-milan.mp4",
    sideHighlights: {
      left: [
        { label: "Milano Centrale", prominence: "high" },
        { label: "Navigli" }
      ],
      right: [
        { label: "Duomo", prominence: "high" },
        { label: "Galleria" }
      ]
    },
    tone: { from: "#ef4444", to: "#f97316" },
    silhouette: "city",
    timeline: [
      { label: "Morning", caption: "인터라켄 출발" },
      { label: "Afternoon", caption: "밀라노 도착" },
      { label: "Evening", caption: "나빌리오" }
    ]
  },
  {
    day: 9,
    city: "Venice",
    country: "Italy",
    title: "물길 위의 하루",
    summary: "베네치아, 느린 시간에 머무르다",
    heroImage:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=80",
    heroVideo: "/videos/day9-Venice.mp4",
    sideHighlights: {
      left: [
        { label: "St. Mark's Square", prominence: "high" },
        { label: "Grand Canal" }
      ],
      right: [
        { label: "Rialto Bridge", prominence: "high" },
        { label: "Gondola" }
      ]
    },
    tone: { from: "#14b8a6", to: "#0ea5e9" },
    silhouette: "coast",
    timeline: [
      { label: "Morning", caption: "밀라노 출발" },
      { label: "Afternoon", caption: "산마르코" },
      { label: "Evening", caption: "리알토" }
    ]
  },
  {
    day: 10,
    city: "Milan",
    country: "Italy",
    title: "마지막 장면, 밀라노",
    summary: "도심을 지나 공항으로",
    heroImage:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2000&q=80",
    heroVideo: "/videos/day10-milan.mp4",
    sideHighlights: {
      left: [
        { label: "Duomo", prominence: "high" },
        { label: "Galleria" }
      ],
      right: [
        { label: "Milano Out", prominence: "high" },
        { label: "Last Walk" }
      ]
    },
    tone: { from: "#f97316", to: "#7c2d12" },
    silhouette: "city",
    timeline: [
      { label: "Morning", caption: "두오모" },
      { label: "Afternoon", caption: "갤러리아" },
      { label: "Evening", caption: "밀라노 Out" }
    ]
  }
];
