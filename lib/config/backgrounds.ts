export const BACKGROUNDS_CONFIG = {
  gradients: [
    {
      id: 'default',
      className: 'bg-gradient-to-b from-slate-600 to-slate-900',
      label: 'Default Dark'
    },
    {
      id: 'gradient1',
      className: 'bg-gradient-to-r from-rose-400 to-orange-300',
      label: 'Sunset'
    },
    {
      id: 'gradient2',
      className: 'bg-gradient-to-r from-blue-400 to-emerald-400',
      label: 'Ocean'
    },
    {
      id: 'gradient3',
      className: 'bg-gradient-to-r from-violet-500 to-purple-500',
      label: 'Purple'
    }
  ],
  images: [
    {
      id: 'autumn',
      path: '/backgrounds/autumn.png',
      label: 'Autumn'
    },
    {
      id: 'winter',
      path: '/backgrounds/winter.png',
      label: 'Winter'
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
    }
  ]
} as const

export function getBackgroundStyle(style: string = 'default'): string {
  const allBackgrounds = [
    ...BACKGROUNDS_CONFIG.gradients.map(g => ({ id: g.id, className: g.className })),
    ...BACKGROUNDS_CONFIG.images.map(i => ({ 
      id: i.id, 
      className: `bg-cover bg-center`
    }))
  ]
  
  const background = allBackgrounds.find(bg => bg.id === style)
  return background?.className || allBackgrounds[0].className
} 