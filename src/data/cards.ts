export type ProjectId = 1 | 2 | 3

export type PortfolioCard = {
  id: string
  projectId: ProjectId
  projectLabel: string
  stepInProject: number
  stepsInProject: number
  title: string
  goal: string
  action: string
  result: string
}

/** 图片命名约定：将文件放在 public/portfolio/ 下，如 p1-01.jpg … p3-05.jpg */
export function cardImageSrc(projectId: ProjectId, stepInProject: number): string {
  const n = String(stepInProject).padStart(2, '0')
  return `/portfolio/p${projectId}-${n}.jpg`
}

export const portfolioCards: PortfolioCard[] = [
  // Project 1 — Monetization
  {
    id: 'p1-1',
    projectId: 1,
    projectLabel: 'Monetization & Conversion',
    stepInProject: 1,
    stepsInProject: 5,
    title: 'Monetization Challenge',
    goal: 'Increase paid conversion',
    action: 'Identified friction in campaign entry and purchase decision',
    result: 'Set direction for campaign optimization',
  },
  {
    id: 'p1-2',
    projectId: 1,
    projectLabel: 'Monetization & Conversion',
    stepInProject: 2,
    stepsInProject: 5,
    title: 'Urgency Strategy — Black Friday',
    goal: 'Drive immediate purchase action',
    action: 'Designed high-impact promotional banner with clear limited-time message',
    result: 'Improved click-through rate',
  },
  {
    id: 'p1-3',
    projectId: 1,
    projectLabel: 'Monetization & Conversion',
    stepInProject: 3,
    stepsInProject: 5,
    title: 'Value Strategy — Membership + Hardware Bundle',
    goal: 'Increase perceived value of membership',
    action: 'Designed bundle campaign to make the offer more compelling',
    result: 'Improved purchase intent and conversion performance',
  },
  {
    id: 'p1-4',
    projectId: 1,
    projectLabel: 'Monetization & Conversion',
    stepInProject: 4,
    stepsInProject: 5,
    title: 'Landing Page Optimization',
    goal: 'Reduce decision friction',
    action: 'Simplified benefit hierarchy, clarified offer structure, strengthened CTA',
    result: 'Improved user decision-making',
  },
  {
    id: 'p1-5',
    projectId: 1,
    projectLabel: 'Monetization & Conversion',
    stepInProject: 5,
    stepsInProject: 5,
    title: 'Result',
    goal: 'Improve monetization performance',
    action: 'Combined urgency, value, and clearer information structure',
    result: 'Increased campaign conversion efficiency',
  },
  // Project 2 — Growth
  {
    id: 'p2-1',
    projectId: 2,
    projectLabel: 'User Growth & Engagement',
    stepInProject: 1,
    stepsInProject: 5,
    title: 'Growth Challenge',
    goal: 'Increase user activation and ongoing engagement',
    action: 'Identified the need for stronger entry points and clearer user targeting',
    result: 'Defined a more effective engagement design direction',
  },
  {
    id: 'p2-2',
    projectId: 2,
    projectLabel: 'User Growth & Engagement',
    stepInProject: 2,
    stepsInProject: 5,
    title: 'High-Exposure Banner Design',
    goal: 'Capture attention in key app traffic positions',
    action: 'Designed banners with stronger visual hierarchy and clearer benefits',
    result: 'Improved entry click performance',
  },
  {
    id: 'p2-3',
    projectId: 2,
    projectLabel: 'User Growth & Engagement',
    stepInProject: 3,
    stepsInProject: 5,
    title: 'Targeted Visual Communication',
    goal: 'Increase relevance for different user groups',
    action: 'Added labels and clearer contextual messaging to guide user attention',
    result: 'Improved interaction quality',
  },
  {
    id: 'p2-4',
    projectId: 2,
    projectLabel: 'User Growth & Engagement',
    stepInProject: 4,
    stepsInProject: 5,
    title: 'Badge & Incentive Design',
    goal: 'Support retention and return behavior',
    action: 'Designed reward visuals and lightweight gamified engagement cues',
    result: 'Strengthened user participation and stickiness',
  },
  {
    id: 'p2-5',
    projectId: 2,
    projectLabel: 'User Growth & Engagement',
    stepInProject: 5,
    stepsInProject: 5,
    title: 'Result',
    goal: 'Improve activity and engagement',
    action: 'Optimized high-visibility communication and retention-oriented visuals',
    result: 'Supported higher user activation and stronger monthly engagement',
  },
  // Project 3 — Education
  {
    id: 'p3-1',
    projectId: 3,
    projectLabel: 'Product Education & Adoption',
    stepInProject: 1,
    stepsInProject: 5,
    title: 'Feature Adoption Challenge',
    goal: 'Increase adoption of key functions on new devices',
    action: 'Identified that users did not fully understand new features',
    result: 'Set direction for educational design',
  },
  {
    id: 'p3-2',
    projectId: 3,
    projectLabel: 'Product Education & Adoption',
    stepInProject: 2,
    stepsInProject: 5,
    title: 'Education Strategy',
    goal: 'Bridge product selling points and user understanding',
    action: 'Structured educational content around core features and real use scenarios',
    result: 'Created a clearer path to understanding',
  },
  {
    id: 'p3-3',
    projectId: 3,
    projectLabel: 'Product Education & Adoption',
    stepInProject: 3,
    stepsInProject: 5,
    title: 'Feature Education System',
    goal: 'Help users understand product value',
    action:
      'Designed a series of in-app educational pages for ECG, offline maps, and sports features',
    result: 'Built a consistent guidance experience',
  },
  {
    id: 'p3-4',
    projectId: 3,
    projectLabel: 'Product Education & Adoption',
    stepInProject: 4,
    stepsInProject: 5,
    title: 'Complex Feature Simplification',
    goal: 'Reduce learning friction',
    action: 'Turned complex feature information into simple visual communication',
    result: 'Improved readability and confidence',
  },
  {
    id: 'p3-5',
    projectId: 3,
    projectLabel: 'Product Education & Adoption',
    stepInProject: 5,
    stepsInProject: 5,
    title: 'Result',
    goal: 'Improve feature usage',
    action: 'Aligned education content with key product selling points',
    result: 'Increased feature usage rate and improved product value perception',
  },
]

/** 三个项目分组，顺序为 1 → 2 → 3，用于并排 Cover Flow */
export function getProjectGroups(): {
  projectId: ProjectId
  label: string
  cards: PortfolioCard[]
}[] {
  const byId: Record<ProjectId, PortfolioCard[]> = { 1: [], 2: [], 3: [] }
  for (const c of portfolioCards) {
    byId[c.projectId].push(c)
  }
  return ([1, 2, 3] as const).map((id) => ({
    projectId: id,
    label: byId[id][0]?.projectLabel ?? `Project ${id}`,
    cards: byId[id],
  }))
}
