import { Question, QuizCatalogItem, LeaderboardPlayer } from '../types/quiz';

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 1,
    category: '⚡ Dasturlash & Web Asoslari',
    points: 1000,
    timeLimit: 20,
    text: "HTML5 standartida semantik teg sifatida qaysi biri sahifaning mustaqil mazmunini ifodalaydi?",
    highlightKeyword: 'mustaqil mazmunini',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvpHsTG47SJTW73R0fJrq7GCF7EG14RJmk2cCM_VmySED74jFUQC86WJWKSxWIITYy2OFreikW7lIY3Xv4vVcvOB8LEMBS9p7vkJqkHrEMGDfmcA0C0kumpgoMa8k8GuIgxD95fY2eGqlMIIH1QNvFo9zhc8zIzAolKZ8dkwIG_vk5u672ZOocmRCu_V5Tn7vpFDmRyZA5MXccwfiGBXV54uqMt-fBw6QQFF_tIL6E51BZAXBU1dNT',
    imageAlt: 'Web development HTML5 architecture neon graphic',
    options: {
      A: '<section>',
      B: '<article>',
      C: '<aside>',
      D: '<div>'
    },
    correctOption: 'B',
    explanation: '<article> tegi o\'zi mustaqil, tarqatishga yaroqli maqola, blog posti yoki yangilikni bildiradi.',
    votes: { A: 4, B: 34, C: 2, D: 2 }
  },
  {
    id: 2,
    category: '⚡ JavaScript & Frontend Engine',
    points: 1000,
    timeLimit: 20,
    text: "JavaScript dvijokida 'Temporal Dead Zone' (TDZ) qaysi o'zgaruvchi e'lonlariga tegishli?",
    highlightKeyword: 'Temporal Dead Zone',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvpHsTG47SJTW73R0fJrq7GCF7EG14RJmk2cCM_VmySED74jFUQC86WJWKSxWIITYy2OFreikW7lIY3Xv4vVcvOB8LEMBS9p7vkJqkHrEMGDfmcA0C0kumpgoMa8k8GuIgxD95fY2eGqlMIIH1QNvFo9zhc8zIzAolKZ8dkwIG_vk5u672ZOocmRCu_V5Tn7vpFDmRyZA5MXccwfiGBXV54uqMt-fBw6QQFF_tIL6E51BZAXBU1dNT',
    imageAlt: 'JavaScript V8 engine temporal dead zone memory stack',
    options: {
      A: 'Faqat var',
      B: 'let va const',
      C: 'Faqat function',
      D: 'class va global'
    },
    correctOption: 'B',
    explanation: 'let va const o\'zgaruvchilari e\'lon qilingan qatorgacha TDZ da bo\'ladi va ularga murojaat ReferenceError beradi.',
    votes: { A: 6, B: 31, C: 3, D: 2 }
  },
  {
    id: 3,
    category: '⚡ Tarmoq & Protokollar',
    points: 1000,
    timeLimit: 20,
    text: "HTTP/2 va HTTP/3 protokollarining asosiy transport qatlami farqi nimada?",
    highlightKeyword: 'transport qatlami',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuOOrfg3K1e02x82_k_IoP4ugFdKCFKFgc9ujJ6E6Jpk7ds4y9AnEII27MVX2JQcmle0QWUjNjzBCMRMgQ8sMoZvEeB03mbVhbsG9Q4VRs0ETTEQZYjbKlJg5isIwkoastwoVrCnZcsz2tfUnfY3NbxYNls7cCu9eA2KHQG6d94X1Z0dLunMOSk3fBDU7bijGCHCByfjD-Gt03G8kj8PE8hZQUWs6vZ2IrRPh-wk2Bsddqg9lXpbDi',
    imageAlt: 'Network UDP and TCP sockets visualization',
    options: {
      A: 'HTTP/3 TCP dan foydalanadi',
      B: 'HTTP/3 UDP asosidagi QUIC da ishlaydi',
      C: 'Faqat shifrlash yo\'q qilingan',
      D: 'Port 80 to\'liq yopilgan'
    },
    correctOption: 'B',
    explanation: 'HTTP/3 UDP protokoli ustiga qurilgan QUIC transportidan foydalanib bosh qatordagi to\'siq (Head-of-Line blocking) muammosini hal qiladi.',
    votes: { A: 2, B: 35, C: 1, D: 4 }
  },
  {
    id: 4,
    category: '⚡ Dasturlash & Algoritmlar',
    points: 1000,
    timeLimit: 20,
    text: "Qaysi ma'lumotlar tuzilmasi LIFO (Last-In, First-Out) tamoyilida ishlaydi?",
    highlightKeyword: 'LIFO',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuOOrfg3K1e02x82_k_IoP4ugFdKCFKFgc9ujJ6E6Jpk7ds4y9AnEII27MVX2JQcmle0QWUjNjzBCMRMgQ8sMoZvEeB03mbVhbsG9Q4VRs0ETTEQZYjbKlJg5isIwkoastwoVrCnZcsz2tfUnfY3NbxYNls7cCu9eA2KHQG6d94X1Z0dLunMOSk3fBDU7bijGCHCByfjD-Gt03G8kj8PE8hZQUWs6vZ2IrRPh-wk2Bsddqg9lXpbDi',
    imageAlt: 'A pixel-art arcade illustration displaying retro stack memory cards illuminated by electric blue and yellow neon lights, 16-bit cyber game aesthetic',
    options: {
      A: 'Queue (Navbat)',
      B: 'Stack (Stek)',
      C: 'Linked List (Bog\'langan)',
      D: 'Binary Tree (Daraxt)'
    },
    correctOption: 'B',
    explanation: 'LIFO mexanizmi: oxirgi kiritilgan element birinchi chiqariladi. Stek (Stack) aynan shu asosda ishlaydi.',
    votes: { A: 3, B: 32, C: 2, D: 1 }
  },
  {
    id: 5,
    category: '⚡ Asinxron Dasturlash',
    points: 1000,
    timeLimit: 20,
    text: "JavaScript tilida event loop mexanizmida Microtask queue ga quyidagilardan qaysi biri tushadi?",
    highlightKeyword: 'Microtask queue',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvpHsTG47SJTW73R0fJrq7GCF7EG14RJmk2cCM_VmySED74jFUQC86WJWKSxWIITYy2OFreikW7lIY3Xv4vVcvOB8LEMBS9p7vkJqkHrEMGDfmcA0C0kumpgoMa8k8GuIgxD95fY2eGqlMIIH1QNvFo9zhc8zIzAolKZ8dkwIG_vk5u672ZOocmRCu_V5Tn7vpFDmRyZA5MXccwfiGBXV54uqMt-fBw6QQFF_tIL6E51BZAXBU1dNT',
    imageAlt: 'Event loop call stack and microtask queue flowchart',
    options: {
      A: 'setTimeout() va setInterval() callbacklari',
      B: 'Promise.then() va queueMicrotask()',
      C: 'DOM Click va Keyboard hodisalari',
      D: 'Faqat WebSockets xabarlari'
    },
    correctOption: 'B',
    explanation: 'Promise.then, catch, finally va queueMicrotask() callbacklari har bir macrotask tugashi bilan navbatdan oldin bajariladigan Microtask queue ga yuboriladi.',
    votes: { A: 5, B: 33, C: 2, D: 2 }
  },
  {
    id: 6,
    category: '⚡ Ma\'lumotlar Bazasi & SQL',
    points: 1000,
    timeLimit: 20,
    text: "Relatsion ma'lumotlar bazalarida ACID tamoyilidagi 'I' harfi nimani anglatadi?",
    highlightKeyword: 'ACID',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIGWMK6y_pz8oHZVaEHOSP_qRjYNSLXwVCLMM0CeClqLt-LyFDm0Iwck6_cDtO-5Jv26GUcpPWBe2HpUcvr7VhrMV0zxrvMxED9MLnvgBjEaeN9-ZmP9FBZAe1xSHabDBKv-26ddNw4pbbNjkMOt-TNAwdzmvQALKraJaW88C1o6SbyUEIDDdJjgzvXs5cY-B0IMqY2OGEhoOB94BlpLJmwWbYoohuTnliCvima61lRDYAj6TiIN9g',
    imageAlt: 'Database ACID transactions isolation lock icon',
    options: {
      A: 'Integrity (Yaxlitlik)',
      B: 'Isolation (Alohidalik)',
      C: 'Indexation (Indekslash)',
      D: 'Identity (Identifikatsiya)'
    },
    correctOption: 'B',
    explanation: 'ACID: Atomicity, Consistency, Isolation, Durability. Isolation bir vaqtda ishlaydigan tranzaksiyalarning bir-biriga xalaqit bermasligini ta\'minlaydi.',
    votes: { A: 4, B: 32, C: 4, D: 2 }
  }
];

export const INITIAL_LEADERBOARD: LeaderboardPlayer[] = [
  {
    id: 'p-1',
    name: 'Sardor (Iron Man)',
    avatar: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&w=256&q=80',
    avatarEmoji: '🤖',
    score: 4820,
    rank: 1,
    streak: 4,
    recentGain: 940,
    isCurrentUser: false
  },
  {
    id: 'p-2',
    name: 'Malika (Spider-Man)',
    avatar: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=256&q=80',
    avatarEmoji: '🕷️',
    score: 4350,
    rank: 2,
    streak: 3,
    recentGain: 880,
    isCurrentUser: false
  },
  {
    id: 'p-3',
    name: 'Jasur (Batman)',
    avatar: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=256&q=80',
    avatarEmoji: '🦇',
    score: 3990,
    rank: 3,
    streak: 2,
    recentGain: 720,
    isCurrentUser: false
  },
  {
    id: 'p-4',
    name: 'Anvar (Thor)',
    avatar: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=256&q=80',
    avatarEmoji: '⚡',
    score: 3410,
    rank: 4,
    streak: 1,
    recentGain: 610,
    isCurrentUser: false
  },
  {
    id: 'p-5',
    name: 'Dilshod (Superman)',
    avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=256&q=80',
    avatarEmoji: '🦸',
    score: 3120,
    rank: 5,
    streak: 1,
    recentGain: 590,
    isCurrentUser: false
  }
];

export const INITIAL_QUIZ_CATALOG: QuizCatalogItem[] = [
  {
    id: 'quiz-1',
    title: 'Fullstack Dasturchilar Jangi 2025',
    category: 'IT & Dasturlash',
    status: 'active',
    questionCount: 15,
    timesPlayed: 820,
    timePerQuestion: 15,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvpHsTG47SJTW73R0fJrq7GCF7EG14RJmk2cCM_VmySED74jFUQC86WJWKSxWIITYy2OFreikW7lIY3Xv4vVcvOB8LEMBS9p7vkJqkHrEMGDfmcA0C0kumpgoMa8k8GuIgxD95fY2eGqlMIIH1QNvFo9zhc8zIzAolKZ8dkwIG_vk5u672ZOocmRCu_V5Tn7vpFDmRyZA5MXccwfiGBXV54uqMt-fBw6QQFF_tIL6E51BZAXBU1dNT'
  },
  {
    id: 'quiz-2',
    title: "O'zbekiston Tarixi: Amir Temur davri",
    category: 'Tarix & Madaniyat',
    status: 'active',
    questionCount: 20,
    timesPlayed: 1210,
    timePerQuestion: 20,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIGWMK6y_pz8oHZVaEHOSP_qRjYNSLXwVCLMM0CeClqLt-LyFDm0Iwck6_cDtO-5Jv26GUcpPWBe2HpUcvr7VhrMV0zxrvMxED9MLnvgBjEaeN9-ZmP9FBZAe1xSHabDBKv-26ddNw4pbbNjkMOt-TNAwdzmvQALKraJaW88C1o6SbyUEIDDdJjgzvXs5cY-B0IMqY2OGEhoOB94BlpLJmwWbYoohuTnliCvima61lRDYAj6TiIN9g'
  },
  {
    id: 'quiz-3',
    title: 'Astrofizika va Qora tuynuklar',
    category: 'Koinot & Fizika',
    status: 'draft',
    questionCount: 8,
    timesPlayed: 0,
    timePerQuestion: 8,
    imageUrl: ''
  }
];

export const INITIAL_LOBBY_USERS = [
  { id: 'u-1', name: 'Shohrux_Frontend', score: 2450, ping: 22, flag: 'normal' },
  { id: 'u-2', name: 'SpamBot_99x', score: 0, ping: 198, flag: 'suspicious' },
  { id: 'u-3', name: 'Nodira_Samarkand', score: 1890, ping: 35, flag: 'normal' },
  { id: 'u-4', name: 'CyberSardor', score: 3450, ping: 18, flag: 'normal' },
  { id: 'u-5', name: 'Bek_Tashkent', score: 1200, ping: 28, flag: 'normal' }
];

export const AVATAR_OPTIONS = [
  { id: 'robot', emoji: '🤖', name: 'Robot' },
  { id: 'alien', emoji: '👽', name: 'Alien' },
  { id: 'cat', emoji: '🕶️', name: 'Mushuk' },
  { id: 'ninja', emoji: '🥷', name: 'Ninja' },
  { id: 'wizard', emoji: '🧙', name: 'Sehrgar' }
];
