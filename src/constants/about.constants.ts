export const ABOUT = {
  profile: {
    name: "노현수",
    role: "QA Engineer",
    bio: "품질을 통해 더 나은 사용자 경험을 만듭니다. 꼼꼼한 테스트와 체계적인 프로세스로 안정적인 서비스를 추구합니다.",
    email: "kevinsoo1014@gmail.com",
    github: "https://github.com/toosign00",
    instagram: "https://instagram.com/too_sign",
  },

  skills: [
    {
      level: "능숙",
      items: [
        "Test Planning",
        "Manual Testing",
        "Bug Tracking",
        "Jira",
        "Confluence",
        "SQL",
      ],
    },
    {
      level: "사용 가능",
      items: [
        "Playwright",
        "Cypress",
        "TypeScript",
        "Python",
        "Postman",
        "Git",
      ],
    },
    {
      level: "학습 중",
      items: ["k6", "Grafana", "Jenkins", "Docker"],
    },
  ],

  career: [
    {
      company: "스타트업 A",
      role: "QA Engineer",
      period: "2024.03 — 현재",
      description: "서비스 전반의 품질 관리 및 테스트 자동화 구축",
    },
    {
      company: "에이전시 B",
      role: "Junior QA",
      period: "2023.01 — 2024.02",
      description: "웹/앱 서비스 기능 테스트 및 회귀 테스트 수행",
    },
  ],

  education: [
    {
      school: "OO대학교",
      major: "컴퓨터공학과",
      period: "2018 — 2024",
    },
  ],
} as const;
