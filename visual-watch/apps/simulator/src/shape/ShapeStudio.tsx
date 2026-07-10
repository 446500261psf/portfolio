import type { CaseParams } from './CaseParams'
import { MainPreview, OrthoPanel } from './ShapeCanvases'

interface ShapeStudioProps {
  params: CaseParams
}

export function ShapeStudio({ params }: ShapeStudioProps) {
  return (
    <div className="shape-studio">
      <div className="shape-viewports">
        <div className="view-frame view-frame--main">
          <span className="view-label">三维预览 · 拖拽旋转</span>
          <MainPreview params={params} />
        </div>

        <div className="triple-row">
          <div className="view-frame view-frame--ortho">
            <span className="view-label">正视图 Front</span>
            <OrthoPanel params={params} view="front" />
          </div>
          <div className="view-frame view-frame--ortho">
            <span className="view-label">侧视图 Side</span>
            <OrthoPanel params={params} view="side" />
          </div>
          <div className="view-frame view-frame--ortho">
            <span className="view-label">俯视图 Top</span>
            <OrthoPanel params={params} view="top" />
          </div>
        </div>
      </div>
    </div>
  )
}
