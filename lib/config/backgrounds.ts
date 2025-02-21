export const BACKGROUNDS_CONFIG = {
  gradients: [
    {
      id: 'default',
      className: 'bg-gradient-to-b from-slate-600 to-slate-900 hover:from-slate-500 hover:to-slate-800',
      label: 'Default Dark'
    },
    {
      id: 'gradient1',
      className: 'bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500',
      label: 'Sunset'
    },
    {
      id: 'gradient2',
      className: 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500',
      label: 'Ocean'
    },
    {
      id: 'gradient3',
      className: 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500',
      label: 'Purple'
    }
  ],
  images: [
    {
      id: 'balloons',
      path: '/backgrounds/balloons.png',
      label: 'Balloons'
    },
    {
      id: 'beach',
      path: '/backgrounds/beach.png',
      label: 'Beach'
    },
    {
      id: 'easter',
      path: '/backgrounds/easter.png',
      label: 'Easter'
    },
    {
      id: 'grill',
      path: '/backgrounds/grill.png',
      label: 'BBQ'
    },
    {
      id: 'halloween',
      path: '/backgrounds/halloween.png',
      label: 'Halloween'
    },
    {
      id: 'mountains',
      path: '/backgrounds/mountains.png',
      label: 'Mountains'
    },
    {
      id: 'spring',
      path: '/backgrounds/spring.png',
      label: 'Spring'
    },
    {
      id: 'summer',
      path: '/backgrounds/summer.png',
      label: 'Summer'
    },
    {
      id: 'winter',
      path: '/backgrounds/winter.png',
      label: 'Winter'
    },
    {
      id: 'autumn',
      path: '/backgrounds/autumn.png',
      label: 'Autumn'
    }
  ]
} as const

export function getBackgroundStyle(style: string = 'default'): string {
  const allBackgrounds = [
    ...BACKGROUNDS_CONFIG.gradients.map(g => ({ id: g.id, className: g.className })),
    ...BACKGROUNDS_CONFIG.images.map(i => ({ 
      id: i.id, 
      className: `bg-[url('${i.path}')] bg-cover bg-center` 
    }))
  ]
  
  const background = allBackgrounds.find(bg => bg.id === style)
  return background?.className || allBackgrounds[0].className
}
