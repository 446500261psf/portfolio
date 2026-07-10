import type { CaseParams } from './CaseParams'
import { ThreeViewSheet } from './ThreeViewSheet'

interface ShapeStudioProps {
  params: CaseParams
}

/** 外形工作室：2D 三视图轮廓编辑器（暂不使用 3D） */
export function ShapeStudio({ params }: ShapeStudioProps) {
  return (
    <div className="shape-studio shape-studio--2d">
      <ThreeViewSheet params={params} />
    </div>
  )
}
