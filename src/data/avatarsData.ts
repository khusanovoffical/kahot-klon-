export interface CharacterAvatar {
  id: string;
  name: string;
  universe: 'Marvel' | 'DC' | 'Animatsiya & O\'yinlar';
  imageUrl: string;
  badgeColor: string;
  fallbackIcon: string;
}

export const CHARACTER_AVATARS: CharacterAvatar[] = [
  // 1-10 Marvel
  {
    id: 'iron-man',
    name: 'Iron Man',
    universe: 'Marvel',
    imageUrl: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#ef4444',
    fallbackIcon: '🤖'
  },
  {
    id: 'spider-man',
    name: 'Spider-Man',
    universe: 'Marvel',
    imageUrl: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#dc2626',
    fallbackIcon: '🕷️'
  },
  {
    id: 'batman',
    name: 'Batman',
    universe: 'DC',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#1e293b',
    fallbackIcon: '🦇'
  },
  {
    id: 'superman',
    name: 'Superman',
    universe: 'DC',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#2563eb',
    fallbackIcon: '🦸'
  },
  {
    id: 'thor',
    name: 'Thor',
    universe: 'Marvel',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#0284c7',
    fallbackIcon: '⚡'
  },
  {
    id: 'captain-america',
    name: 'Captain America',
    universe: 'Marvel',
    imageUrl: 'https://images.unsplash.com/photo-1624213111452-35e8d3d5cc18?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#1d4ed8',
    fallbackIcon: '🛡️'
  },
  {
    id: 'hulk',
    name: 'Hulk',
    universe: 'Marvel',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#16a34a',
    fallbackIcon: '💚'
  },
  {
    id: 'wolverine',
    name: 'Wolverine',
    universe: 'Marvel',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#ca8a04',
    fallbackIcon: '🐺'
  },
  {
    id: 'deadpool',
    name: 'Deadpool',
    universe: 'Marvel',
    imageUrl: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#b91c1c',
    fallbackIcon: '⚔️'
  },
  {
    id: 'black-panther',
    name: 'Black Panther',
    universe: 'Marvel',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#7c3aed',
    fallbackIcon: '🐾'
  },
  // 11-20 DC & Marvel
  {
    id: 'flash',
    name: 'The Flash',
    universe: 'DC',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#ea580c',
    fallbackIcon: '⚡'
  },
  {
    id: 'wonder-woman',
    name: 'Wonder Woman',
    universe: 'DC',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#e11d48',
    fallbackIcon: '👑'
  },
  {
    id: 'joker',
    name: 'Joker',
    universe: 'DC',
    imageUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#9333ea',
    fallbackIcon: '🃏'
  },
  {
    id: 'thanos',
    name: 'Thanos',
    universe: 'Marvel',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#6b21a8',
    fallbackIcon: '💎'
  },
  {
    id: 'doctor-strange',
    name: 'Doctor Strange',
    universe: 'Marvel',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#0891b2',
    fallbackIcon: '🔮'
  },
  {
    id: 'venom',
    name: 'Venom',
    universe: 'Marvel',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#0f172a',
    fallbackIcon: '👅'
  },
  {
    id: 'green-lantern',
    name: 'Green Lantern',
    universe: 'DC',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#059669',
    fallbackIcon: '🟢'
  },
  {
    id: 'aquaman',
    name: 'Aquaman',
    universe: 'DC',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#0d9488',
    fallbackIcon: '🔱'
  },
  {
    id: 'harley-quinn',
    name: 'Harley Quinn',
    universe: 'DC',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#f43f5e',
    fallbackIcon: '🎪'
  },
  {
    id: 'loki',
    name: 'Loki',
    universe: 'Marvel',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#15803d',
    fallbackIcon: '🗡️'
  },
  // 21-30 Animation & Gaming
  {
    id: 'miles-morales',
    name: 'Miles Morales',
    universe: 'Marvel',
    imageUrl: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#e11d48',
    fallbackIcon: '🕷️'
  },
  {
    id: 'scarlet-witch',
    name: 'Scarlet Witch',
    universe: 'Marvel',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#be123c',
    fallbackIcon: '✨'
  },
  {
    id: 'nightwing',
    name: 'Nightwing',
    universe: 'DC',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#0284c7',
    fallbackIcon: '🦅'
  },
  {
    id: 'groot',
    name: 'Groot',
    universe: 'Marvel',
    imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#854d0e',
    fallbackIcon: '🌱'
  },
  {
    id: 'shrek',
    name: 'Shrek',
    universe: 'Animatsiya & O\'yinlar',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#65a30d',
    fallbackIcon: '👹'
  },
  {
    id: 'kung-fu-panda',
    name: 'Po (Panda)',
    universe: 'Animatsiya & O\'yinlar',
    imageUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef6?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#1f2937',
    fallbackIcon: '🐼'
  },
  {
    id: 'simba',
    name: 'Simba',
    universe: 'Animatsiya & O\'yinlar',
    imageUrl: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#d97706',
    fallbackIcon: '🦁'
  },
  {
    id: 'sonic',
    name: 'Sonic the Hedgehog',
    universe: 'Animatsiya & O\'yinlar',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#2563eb',
    fallbackIcon: '🦔'
  },
  {
    id: 'mario',
    name: 'Super Mario',
    universe: 'Animatsiya & O\'yinlar',
    imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#dc2626',
    fallbackIcon: '🍄'
  },
  {
    id: 'naruto',
    name: 'Naruto Uzumaki',
    universe: 'Animatsiya & O\'yinlar',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#f97316',
    fallbackIcon: '🍥'
  },
  // 31-40 Popular Icons
  {
    id: 'pikachu',
    name: 'Pikachu',
    universe: 'Animatsiya & O\'yinlar',
    imageUrl: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#eab308',
    fallbackIcon: '⚡'
  },
  {
    id: 'buzz-lightyear',
    name: 'Buzz Lightyear',
    universe: 'Animatsiya & O\'yinlar',
    imageUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#84cc16',
    fallbackIcon: '🚀'
  },
  {
    id: 'woody',
    name: 'Woody',
    universe: 'Animatsiya & O\'yinlar',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#b45309',
    fallbackIcon: '🤠'
  },
  {
    id: 'optimus-prime',
    name: 'Optimus Prime',
    universe: 'Animatsiya & O\'yinlar',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#1e40af',
    fallbackIcon: '🚛'
  },
  {
    id: 'spongebob',
    name: 'SpongeBob',
    universe: 'Animatsiya & O\'yinlar',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#eab308',
    fallbackIcon: '🧽'
  },
  {
    id: 'mickey-mouse',
    name: 'Mickey Mouse',
    universe: 'Animatsiya & O\'yinlar',
    imageUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#18181b',
    fallbackIcon: '🐭'
  },
  {
    id: 'lightning-mcqueen',
    name: 'Lightning McQueen',
    universe: 'Animatsiya & O\'yinlar',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#ef4444',
    fallbackIcon: '🏎️'
  },
  {
    id: 'donkey-kong',
    name: 'Donkey Kong',
    universe: 'Animatsiya & O\'yinlar',
    imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#78350f',
    fallbackIcon: '🦍'
  },
  {
    id: 'goku',
    name: 'Son Goku',
    universe: 'Animatsiya & O\'yinlar',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#ea580c',
    fallbackIcon: '🔥'
  },
  {
    id: 'rick-sanchez',
    name: 'Rick Sanchez',
    universe: 'Animatsiya & O\'yinlar',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=256&q=80',
    badgeColor: '#06b6d4',
    fallbackIcon: '🧪'
  }
];

// Helper fallback image generator with SVG data URI if network drops
export function getAvatarFallbackUrl(name: string, bg = '#181e36'): string {
  const initials = name
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="16" fill="${bg}"/>
    <text x="50%" y="54%" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="44" fill="#5de6ff" text-anchor="middle" dominant-baseline="middle">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
