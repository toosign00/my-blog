import profileImage from "@assets/images/profile.webp";

export const ABOUT = {
  profile: {
    name: "노현수",
    role: "QA Engineer",
    profileImage,
    cardBackgroundColor: "#3B82F6",
    profileImageShadowColor: "rgba(30, 64, 175, 0.5)",
    profileImageFilter: "",
    authorTextColor: "#000",
    contentTextColor: "#000",
  },

  howIWork: [
    "기획, 디자인, 개발까지 직접 경험한 시각으로 서비스 품질을 책임지는 QA Engineer 노현수입니다.",
    "다양한 테스트 기법을 활용하여 품질을 검증하며 새로운 도전과 꾸준한 학습으로 성장하고 있습니다.",
    "함께 성장하는 즐거움을 알기에 협업의 가치를 중요하게 생각합니다.",
    "전체 SDLC(소프트웨어 생명 주기) 흐름을 이해하고 기획 단계부터 잠재적 리스크를 고민하는 습관을 지니고 있습니다.",
  ],

  contacts: [
    {
      type: "copy",
      value: "+821085148477",
      copyType: "phone",
      label: "+821085148477",
      icon: "phone",
    },
    {
      type: "copy",
      value: "hello@toosign.me",
      copyType: "email",
      label: "hello@toosign.me",
      icon: "mail",
    },
    {
      type: "link",
      href: "https://www.linkedin.com/in/hyunsooro",
      label: "Hyunsoo Ro",
      icon: "linkedin",
    },
    {
      type: "link",
      href: "https://github.com/toosign00",
      label: "@toosign00",
      icon: "github",
    },
  ],

  skills: [
    {
      category: "QA / Test",
      items: [
        { label: "Playwright", icon: "playwright" },
        { label: "Postman", icon: "postman" },
        { label: "Chrome DevTools", icon: "chrome" },
      ],
    },
    {
      category: "Language",
      items: [
        { label: "TypeScript", icon: "typescript" },
        { label: "JavaScript", icon: "javascript" },
        { label: "Python", icon: "python" },
        { label: "MySQL", icon: "mysql" },
      ],
    },
    {
      category: "Tools & Communication",
      items: [
        { label: "Jira", icon: "jira" },
        { label: "Confluence", icon: "confluence" },
        { label: "Slack", icon: "slack" },
        { label: "Notion", icon: "notion" },
        { label: "Git", icon: "git" },
        { label: "GitHub", icon: "github" },
        { label: "Figma", icon: "figma" },
        {
          grouped: true,
          label: "AI Code Assistant",
          icons: ["chatgpt", "claude", "gemini"],
        },
      ],
    },
  ],

  education: [
    {
      school: "계원예술대학교",
      major: "디지털미디어디자인과",
      detail: "프로그래밍 세부전공",
      period: "2023.03 - 2025.02",
    },
    {
      school: "고잔고등학교",
      major: "자연과학계열",
      period: "2016.03 - 2019.02",
    },
  ],

  workExperience: [
    {
      title: "고퀄",
      href: "https://www.goqual.com",
      period: "2026.05 - 2026.07",
      tags: ["Intern", "QA Engineer"],
      description: [
        "IoT 앱, 디바이스, 클라우드기반 테스트 시나리오 및 테스트 케이스 설계",
        "단위 기능 테스트, E2E 통합 테스트, Regression 테스트, Exploratory 테스트 수행",
        "디바이스 등록, 제어, 상태 동기화 등 IoT 연동 기능 및 네트워크 환경 기반 테스트 수행",
        "Jira를 활용한 버그 리포트 작성 및 이슈 트래킹 관리",
        "다양한 디바이스 및 OS 환경 호환성 검증 및 품질 리포트 산출",
      ],
    },
    {
      title: "근로복지공단 서울강남지사 (미래내일일경험)",
      period: "2025.01 - 2025.02",
      tags: ["주임", "경영복지부"],
      description: [
        "약 1000건의 대지급금/임금채권 서류 전산 처리, 오류 0건 달성",
        "신청 서류와 전산 데이터 간 정합성 반복 검증을 통한 데이터 무결성 확보",
        "일평균 20건 이상의 서류 검토 및 전산 시스템 등록 수행",
      ],
    },
    {
      title: "세븐일레븐 안산고잔센터점",
      period: "2022.12 - 2025.06",
      tags: ["아르바이트"],
      description: [
        "오픈 시간대 전담 근무로 매장 운영 전반(발주, 재고 관리, 진열) 수행",
        "신입 아르바이트 온보딩 교육을 담당하여 업무 인수인계 및 매장 운영 기준 전달",
        "2년 7개월 장기 근무를 통한 높은 책임감과 안정적인 업무 수행 능력 입증",
      ],
    },
  ],

  achievements: [
    /*
    {
      title: "예시",
      href: "https://example.com",
      period: "2022.11",
      tags: ["예시", "예시2"],
      description: ["예시", "역할:예시"],
    },
    */
    {
      title: "Jira & Agile을 활용한 소프트웨어 테스트 수료",
      period: "2026.04 - 2026.04",
      tags: ["Udemy / 10.5h"],
      description: [
        "소프트웨어 테스트 방법론과 QA 프로세스 전반 학습",
        "Agile Scrum 환경에서 Jira·Xray를 활용한 테스트 케이스 설계 및 결함 생명주기(Defect Lifecycle) 관리 실습",
        "요구사항 수집부터 릴리즈까지 QA 프로세스 전 단계를 이해하고 직접 수행하는 실무 적용력 확보",
      ],
    },
    {
      title: "멋쟁이사자처럼 프론트엔드 부트캠프 13기 수료",
      period: "2025.02 - 2025.08",
      tags: ["멋쟁이사자처럼"],
      description: [
        "웹 표준 및 접근성을 고려한 시맨틱 마크업 구현 역량 강화",
        "TypeScript, React, Next.js, Tailwind CSS를 활용한 모던 프론트엔드 개발",
        "Git/GitHub 기반 팀 협업 및 애자일 방법론과 SDLC 이해를 바탕으로 한 프로젝트 실습",
      ],
    },
    {
      title: "2024 제30회 커뮤니케이션디자인 국제공모전 우수상",
      period: "2024.08",
      tags: ["한국커뮤니케이션디자인협회 주관 / 주체"],
      description: [
        "건강한 치매 생활을 위한 도우미 앱인 '올리' 서비스의 기획 및 서비스 소개 웹페이지 개발 담당",
        "기획부터 개발까지 전 과정 참여하며 매주 정기 회의를 통해  기획, 디자인 팀원들과 기술적 이슈와 해결 방안 공유",
        "페이지 개발 시 Git Flow 전략을 도입하여 팀원들과의 협업 프로세스 구축 및 주도",
        "역할: 웹 개발, 기획 보조",
      ],
    },
  ],

  certificates: [
    {
      title: "ISTQB Certified Tester Foundation Level (CTFL)",
      issuer: "KSTQB (Korean Software Testing Qualifications Board)",
      period: "2025.12",
    },
  ],
} as const;
