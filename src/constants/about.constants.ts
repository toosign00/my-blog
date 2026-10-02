import { METADATA } from './metadata.constants';

export const ABOUT = {
  profile: {
    name: '노현수',
    role: 'QA Engineer',
    profileImage: METADATA.AUTHOR.PROFILE_IMAGE,
    resumeUrl:
      'https://files.toosign.me/%E1%84%82%E1%85%A9%E1%84%92%E1%85%A7%E1%86%AB%E1%84%89%E1%85%AE_%E1%84%8B%E1%85%B5%E1%84%85%E1%85%A7%E1%86%A8%E1%84%89%E1%85%A5.pdf',
    coverLetterUrl:
      'https://files.toosign.me/%E1%84%82%E1%85%A9%E1%84%92%E1%85%A7%E1%86%AB%E1%84%89%E1%85%AE_%E1%84%8C%E1%85%A1%E1%84%80%E1%85%B5%E1%84%89%E1%85%A9%E1%84%80%E1%85%A2%E1%84%89%E1%85%A5.pdf',
    cardBackgroundColor: 'var(--color-profile-card)',
    profileImageShadowColor: 'var(--color-profile-image-shadow)',
    profileImageBorderColor: 'var(--color-profile-image-border)',
    profileImageFilter: '',
    authorTextColor: 'var(--color-profile-title)',
    contentTextColor: 'var(--color-ink)',
  },

  howIWork: [
    '기획, 디자인, 개발까지 직접 경험한 시각으로 서비스의 품질을 책임지는 QA Engineer 노현수입니다.',
    '다양한 테스트 기법을 활용하여 품질을 검증하며 새로운 도전과 꾸준한 학습으로 성장하고 있습니다.',
    '함께 성장하는 즐거움을 알기에 협업의 가치를 중요하게 생각합니다.',
    '전체 SDLC(소프트웨어 생명 주기) 흐름을 이해하고 기획 단계부터 잠재적 리스크를 고민하는 습관을 지니고 있습니다.',
  ],

  contacts: [
    {
      type: 'copy',
      value: '+8210-8514-8477',
      copyType: 'phone',
      label: '+8210-8514-8477',
      icon: 'phone',
    },
    {
      type: 'copy',
      value: 'hello@toosign.me',
      copyType: 'email',
      label: 'hello@toosign.me',
      icon: 'mail',
    },
    {
      type: 'link',
      href: 'https://www.linkedin.com/in/hyunsooro',
      label: 'Hyunsoo Ro',
      icon: 'linkedin',
    },
    {
      type: 'link',
      href: 'https://github.com/toosign00',
      label: '@toosign00',
      icon: 'github',
    },
  ],

  skills: [
    {
      category: 'QA / Test',
      items: [
        { label: 'Playwright', icon: 'playwright' },
        { label: 'Appium', icon: 'appium' },
        { label: 'Maestro', icon: 'maestro' },
        { label: 'Postman', icon: 'postman' },
        { label: 'Chrome DevTools', icon: 'chrome' },
      ],
    },
    {
      category: 'Language',
      items: [
        { label: 'TypeScript', icon: 'typescript' },
        { label: 'JavaScript', icon: 'javascript' },
        { label: 'Python', icon: 'python' },
        { label: 'MySQL', icon: 'mysql' },
      ],
    },
    {
      category: 'Tools & Communication',
      items: [
        { label: 'Jira', icon: 'jira' },
        { label: 'Confluence', icon: 'confluence' },
        { label: 'Slack', icon: 'slack' },
        { label: 'Notion', icon: 'notion' },
        { label: 'Google Sheets', icon: 'googlesheets' },
        { label: 'Git', icon: 'git' },
        { label: 'GitHub', icon: 'github' },
        { label: 'Figma', icon: 'figma' },
        {
          grouped: true,
          label: 'AI Coding Agent',
          icons: ['codex', 'claude-code', 'gemini-cli'],
        },
      ],
    },
  ],

  education: [
    {
      school: '계원예술대학교',
      major: '디지털미디어디자인과',
      detail: '프로그래밍 세부전공',
      period: '2023.03 - 2025.02',
    },
    {
      school: '고잔고등학교',
      major: '자연과학계열',
      period: '2016.03 - 2019.02',
    },
  ],

  workExperience: [
    {
      title: '고퀄',
      href: 'https://www.goqual.com',
      startMonth: '2026.08',
      endMonth: null,
      tags: ['정규직', 'QA Engineer'],
      description: [
        {
          title: 'IoT 모바일 앱 테스트 설계 및 릴리즈 검증',
          items: [
            '스마트홈 플랫폼 헤이홈(Hejhome)의 iOS·Android 신규 기능, Hotfix 및 정기 릴리즈에 대한 기능·통합·회귀 테스트 수행',
            '앱·클라우드·IoT 디바이스 간 연동 구조를 고려하여 제품 등록, 제어, 상태 동기화, 네트워크 변화 등 실제 사용 흐름 기반의 Test Case 설계 및 작성',
            '변경 영향도와 리스크를 기반으로 Smoke, Integration, Regression 테스트 범위를 수립하고 릴리즈 품질 검증',
          ],
        },
        {
          title: 'SDK 전환 및 IoT 연동 품질 검증',
          items: [
            'Tuya 기반 SDK 전환 과정에서 기존 동작과의 기능 비교, 회귀 테스트 및 Side Effect 검증',
            'IoT 디바이스의 펌웨어 업데이트 전후 앱 연동 기능과 주요 제어 시나리오를 비교 검증하고 기능 영향 범위 확인',
            '다양한 디바이스, OS 및 네트워크 환경에서 연결 상태, 제품 제어, 상태 동기화 등 주요 연동 기능의 안정성 검증',
          ],
        },
        {
          title: 'QA 자동화 및 운영 품질 관리',
          items: [
            'AI Agent를 활용한 Geofencing Mock Test 자동화 및 로그 수집·분석을 통해 반복 검증 효율 개선과 이슈 원인 분석',
            'Jira를 활용한 결함 등록·추적·재검증과 Sentry 기반 배포 후 운영 이슈 모니터링',
            '테스트 결과와 주요 결함, 잔여 리스크를 품질 리포트로 정리하여 릴리즈 판단을 위한 검증 결과 공유',
          ],
        },
      ],
    },
    {
      title: '고퀄',
      href: 'https://www.goqual.com',
      startMonth: '2026.05',
      endMonth: '2026.07',
      tags: ['인턴', 'QA Engineer'],
      description: [
        {
          title: 'IoT 모바일 앱 기능 검증',
          items: [
            '헤이홈 iOS·Android 앱의 단위 기능, E2E, Regression, Exploratory 테스트 수행',
            '디바이스 등록, 제어, 상태 동기화 등 주요 IoT 연동 기능과 네트워크 환경별 동작 검증',
            '요구사항과 실제 사용자 시나리오를 기반으로 Test Case 작성 및 테스트 결과 정리',
          ],
        },
        {
          title: '결함 관리 및 회귀 테스트',
          items: [
            'Jira를 활용한 버그 리포트 작성 및 이슈 진행 상황 추적',
            '수정 사항에 대한 재검증과 연관 기능의 Side Effect 및 Regression 확인',
            '통합 테스트와 릴리즈 검증에 참여하며 모바일·IoT 서비스의 QA 프로세스 수행',
          ],
        },
      ],
    },
    {
      title: '근로복지공단 서울강남지사',
      startMonth: '2025.12',
      endMonth: '2026.02',
      tags: ['인턴', '경영복지부'],
      description: [
        {
          items: [
            '약 1000건의 대지급금/임금채권 서류 전산 처리, 오류 0건 달성',
            '신청 서류와 전산 데이터 간 정합성 반복 검증을 통한 데이터 무결성 확보',
            '일평균 20건 이상의 서류 검토 및 전산 시스템 등록 수행',
          ],
        },
      ],
    },
    {
      title: '세븐일레븐 안산고잔센터점',
      startMonth: '2022.12',
      endMonth: '2025.06',
      tags: ['아르바이트'],
      description: [
        {
          items: [
            '오픈 시간대 전담 근무로 매장 운영 전반(발주, 재고 관리, 진열) 수행',
            '신입 아르바이트 온보딩 교육을 담당하여 업무 인수인계 및 매장 운영 기준 전달',
            '2년 7개월 장기 근무를 통한 높은 책임감과 안정적인 업무 수행 능력 입증',
          ],
        },
      ],
    },
  ],

  achievements: [
    /*
    {
      title: '예시',
      href: 'https://example.com',
      period: '2022.11',
      tags: ['예시', '예시2'],
      description: [{ items: ['예시', '역할: 예시'] }],
    },
    */
    {
      title: 'Jira & Agile을 활용한 소프트웨어 테스트 수료',
      period: '2026.04 - 2026.04',
      tags: ['Udemy / 10.5h'],
      description: [
        {
          items: [
            '소프트웨어 테스트 방법론과 QA 프로세스 전반 학습',
            'Agile Scrum 환경에서 Jira·Xray를 활용한 테스트 케이스 설계 및 결함 생명주기(Defect Lifecycle) 관리 실습',
            '요구사항 수집부터 릴리즈까지 QA 프로세스 전 단계를 이해하고 직접 수행하는 실무 적용력 확보',
          ],
        },
      ],
    },
    {
      title: '멋쟁이사자처럼 프론트엔드 부트캠프 13기 수료',
      period: '2025.02 - 2025.08',
      tags: ['멋쟁이사자처럼'],
      description: [
        {
          items: [
            '웹 표준 및 접근성을 고려한 시맨틱 마크업 구현 역량 강화',
            'TypeScript, React, Next.js, Tailwind CSS를 활용한 모던 프론트엔드 개발',
            'Git/GitHub 기반 팀 협업 및 애자일 방법론과 SDLC 이해를 바탕으로 한 프로젝트 실습',
          ],
        },
      ],
    },
    {
      title: '2024 제30회 커뮤니케이션디자인 국제공모전 우수상',
      href: 'https://toosign00.github.io/OLLY',
      period: '2024.07',
      embed: 'https://www.hani.co.kr/arti/economy/biznews/1143531.html',
      tags: ['한국커뮤니케이션디자인협회 주관 / 주체'],
      description: [
        {
          items: [
            "건강한 치매 생활을 위한 도우미 앱인 '올리' 서비스의 기획 및 서비스 소개 웹페이지 개발 담당",
            '기획부터 개발까지 전 과정 참여하며 매주 정기 회의를 통해 기획, 디자인 팀원들과 기술적 이슈와 해결 방안 공유',
            '페이지 개발 시 Git Flow 전략을 도입하여 팀원들과의 협업 프로세스 구축 및 주도',
            'Vietnam Mobile Summit 2024 계원예술대학교 대표작 선정 및 참가',
            '역할: 웹 개발, 기획 보조',
          ],
        },
      ],
    },
  ],

  certificates: [
    {
      title: 'ISTQB Certified Tester Foundation Level (CTFL)',
      issuer: 'KSTQB (Korean Software Testing Qualifications Board)',
      period: '2025.12',
    },
  ],
} as const;
