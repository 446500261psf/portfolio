import { useEffect, useRef, useState } from 'react'
import { publicUrl } from '../publicUrl'

/**
 * Figma 节点 `120:448` / `120:447` / `120:449` 的位图是 **整屏手机成图**，
 * 在 Figma 里用裁切框 (474×H) + 百分比定位把「卡片区域」拉进视窗。
 * 若使用 `object-fit: none` 会按 1:1 像素绘制，只露出长图**左侧**（常是留白），
 * 与 Figma 的 `w-[100%] h-[415%] top-[-77%]`（拉伸填框）效果相反，看起来就像「少了几张图」。
 *
 * 这里对齐 get_design_context 的 DOM：`overflow:hidden` 内层 + 百分比拉伸的 img（fill）。
 */
const LAYERS = [
  {
    name: 'stack1',
    src: publicUrl('figma/black_friday_stack_1.png'),
    left: 648,
    top: 12_224,
    w: 474,
    h: 248,
    img: { width: '100.05%', height: '415.73%', top: '-77.02%', left: '-0.02%' },
  },
  {
    name: 'stack2',
    src: publicUrl('figma/black_friday_stack_2.png'),
    left: 648,
    top: 12_526,
    w: 474,
    h: 318,
    img: { width: '100%', height: '323.8%', top: '-22.36%', left: '0' },
  },
  {
    name: 'stack3',
    src: publicUrl('figma/black_friday_stack_3.png'),
    left: 648,
    top: 12_898,
    w: 474,
    h: 447,
    img: { width: '100.07%', height: '230.46%', top: '-62.53%', left: '-0.03%' },
  },
] as const

export default function BlackFridayStack() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true)
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="bf-stack"
      data-name="black-friday-stack"
      style={{
        position: 'absolute',
        left: 0,
        top: 11_457,
        width: 1440,
        height: 1534,
        pointerEvents: 'none',
        zIndex: 3,
        opacity: active ? 1 : 0,
        transition: 'opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      {LAYERS.map((L) => (
        <div
          key={L.name}
          style={{
            position: 'absolute',
            left: L.left,
            top: L.top - 11_457,
            width: L.w,
            height: L.h,
            overflow: 'hidden',
            borderRadius: 16,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            <img
              src={L.src}
              alt=""
              loading="eager"
              decoding="async"
              draggable={false}
              style={{
                position: 'absolute',
                top: L.img.top,
                left: L.img.left,
                width: L.img.width,
                height: L.img.height,
                maxWidth: 'none',
                display: 'block',
                /* 与 Figma 生成的 Tailwind 一致：在裁切框内把整图拉伸到指定宽高，再被 overflow 裁出卡片区域。 */
                objectFit: 'fill',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
