export type Clip = {
  id: string;
  dayLabel: string;
  title: string;
  country: string;
  city: string;
  landmark: string;
  subtitle: string;
  videoSrc: string;
  theme: "intro" | "rome" | "milan" | "florence" | "swiss" | "venice" | "outro" | "transfer";
};

export const clips: Clip[] = [
  {
    id: "intro",
    dayLabel: "Intro",
    title: "여정의 시작",
    country: "Italy",
    city: "Rome",
    landmark: "Tiber River",
    subtitle: "도시의 첫 숨, 화면에 담다",
    videoSrc: "/swtal_s/video/00-intro.mp4",
    theme: "intro"
  },
  {
    id: "rome-city",
    dayLabel: "Day 1",
    title: "로마, 첫 장면",
    country: "Italy",
    city: "Rome",
    landmark: "City Walk",
    subtitle: "공항에서 시내로, 여행이 시작된다",
    videoSrc: "/swtal_s/video/01-rome-city.mp4",
    theme: "rome"
  },
  {
    id: "colosseum",
    dayLabel: "Day 2",
    title: "고대의 심장",
    country: "Italy",
    city: "Rome",
    landmark: "Colosseum",
    subtitle: "거대한 원형 경기장의 하루",
    videoSrc: "/swtal_s/video/02-colosseum-rome.mp4",
    theme: "rome"
  },
  {
    id: "last-supper",
    dayLabel: "Day 3",
    title: "고요한 벽화",
    country: "Italy",
    city: "Milan",
    landmark: "The Last Supper",
    subtitle: "레오나르도의 시간에 머물다",
    videoSrc: "/swtal_s/video/03-last-supper-milan.mp4",
    theme: "milan"
  },
  {
    id: "pompeii",
    dayLabel: "Day 4",
    title: "멈춘 도시, 폼페이",
    country: "Italy",
    city: "Pompeii",
    landmark: "Pompeii Ruins",
    subtitle: "고대의 시간 위를 걷는다",
    videoSrc: "/swtal_s/video/04-pompeii.mp4",
    theme: "rome"
  },
  {
    id: "rome-to-florence",
    dayLabel: "Day 5",
    title: "르네상스로 이동",
    country: "Italy",
    city: "Rome → Florence",
    landmark: "Rail Journey",
    subtitle: "선로 위, 분위기가 바뀐다",
    videoSrc: "/swtal_s/video/05-rome-to-florence.mp4",
    theme: "transfer"
  },
  {
    id: "florence-cathedral",
    dayLabel: "Day 6",
    title: "피렌체의 황금빛",
    country: "Italy",
    city: "Florence",
    landmark: "Duomo",
    subtitle: "붉은 지붕 아래 하루",
    videoSrc: "/swtal_s/video/06-florence-cathedral.mp4",
    theme: "florence"
  },
  {
    id: "florence-to-swiss",
    dayLabel: "Day 7",
    title: "알프스로 넘어가다",
    country: "Italy / Switzerland",
    city: "Florence → Interlaken",
    landmark: "Crossing",
    subtitle: "풍경이 열리는 이동 구간",
    videoSrc: "/swtal_s/video/07-florence-to-swiss.mp4",
    theme: "transfer"
  },
  {
    id: "interlaken-alps",
    dayLabel: "Day 8",
    title: "알프스가 배경이 되다",
    country: "Switzerland",
    city: "Interlaken",
    landmark: "Alps",
    subtitle: "호수와 산이 하루를 채운다",
    videoSrc: "/swtal_s/video/08-interlaken-alps.mp4",
    theme: "swiss"
  },
  {
    id: "venice",
    dayLabel: "Day 9",
    title: "물길 위의 하루",
    country: "Italy",
    city: "Venice",
    landmark: "Grand Canal",
    subtitle: "느린 시간에 머무르다",
    videoSrc: "/swtal_s/video/09-venice.mp4",
    theme: "venice"
  },
  {
    id: "como-lake",
    dayLabel: "Day 10",
    title: "호수의 여백",
    country: "Italy",
    city: "Como",
    landmark: "Lake Como",
    subtitle: "잔잔한 풍경으로 숨 고르기",
    videoSrc: "/swtal_s/video/10-como-lake.mp4",
    theme: "milan"
  },
  {
    id: "transfer-extra",
    dayLabel: "Day 12",
    title: "home sweet ACA2000",
    country: "Italy",
    city: "Milan",
    landmark: "ACA2000",
    subtitle: "home sweet ACA2000",
    videoSrc: "/swtal_s/video/12-outro.mp4",
    theme: "outro"
  },
  
];
