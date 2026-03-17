export const CHECKLIST_SECTIONS = [
  { id: 'docs',     icon: '📄', titleKey: 'sec_docs',     items: ['doc1','doc2','doc3','doc4','doc5','doc6'] },
  { id: 'elec',     icon: '💻', titleKey: 'sec_elec',     items: ['el1','el2','el3','el4','el5','el6'] },
  { id: 'clothes',  icon: '👕', titleKey: 'sec_clothes',  items: ['cl1','cl2','cl3','cl4','cl5','cl6','cl7','cl8','cl9','cl10'] },
  { id: 'personal', icon: '🧳', titleKey: 'sec_personal', items: ['pe1','pe2','pe3','pe4','pe5','pe6','pe7'] },
]

// Vibe-specific extra sections — shown dynamically based on trip type
export const VIBE_SECTIONS = {
  'Beach Getaway':   { id: 'beach',  icon: '🏖️', titleKey: 'sec_beach',  items: ['be1','be2','be3','be4','be5','be6','be7'] },
  'Nature Retreat':  { id: 'nature', icon: '🌲', titleKey: 'sec_nature', items: ['na1','na2','na3','na4','na5','na6','na7'] },
  'Urban Adventure': { id: 'urban',  icon: '🏙️', titleKey: 'sec_urban',  items: ['ur1','ur2','ur3','ur4','ur5','ur6'] },
  'Foodie Tour':     { id: 'foodie', icon: '🍜', titleKey: 'sec_foodie', items: ['fo1','fo2','fo3','fo4','fo5','fo6'] },
  'Slow Living':     { id: 'slow',   icon: '☕', titleKey: 'sec_slow',   items: ['sl1','sl2','sl3','sl4','sl5','sl6'] },
}