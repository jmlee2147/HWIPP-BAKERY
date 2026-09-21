import { type ComponentPropsWithRef, type ReactNode } from 'react'

/** 대화 박스 — Figma `공용 컴포넌트 / Group 2043688096` */

const WIDTH = 962
const HEIGHT = 319

type Box = { top: string; right: string; bottom: string; left: string }

/**
 * 상단 크림 짤주머니 위치. 두 줄이 어긋나게 겹친다.
 * 모양은 11개가 전부 같아 이미지 하나를 반복해서 쓴다.
 */
const CREAM: Box[] = [
  { top: '0.57%', right: '90.07%', bottom: '78.7%', left: '0' },
  { top: '0.57%', right: '72.01%', bottom: '78.7%', left: '18.06%' },
  { top: '0.57%', right: '54.11%', bottom: '78.7%', left: '35.96%' },
  { top: '0.57%', right: '36.21%', bottom: '78.7%', left: '53.86%' },
  { top: '0.57%', right: '18.15%', bottom: '78.7%', left: '71.92%' },
  { top: '0', right: '81.05%', bottom: '79.27%', left: '9.02%' },
  { top: '0', right: '62.99%', bottom: '79.27%', left: '27.08%' },
  { top: '0', right: '45.09%', bottom: '79.27%', left: '44.98%' },
  { top: '0', right: '27.19%', bottom: '79.27%', left: '62.88%' },
  { top: '0', right: '9.13%', bottom: '79.27%', left: '80.94%' },
  { top: '0', right: '0.62%', bottom: '79.27%', left: '89.45%' },
]

/** 하단 바 위 별 2개 */
const STARS: Box[] = [
  { top: '85.12%', right: '93.43%', bottom: '4.92%', left: '3.26%' },
  { top: '85.12%', right: '89.68%', bottom: '4.92%', left: '7.02%' },
]

/** 위치는 wrapper 가 잡고 img 는 그 안을 채운다. img 에 직접 크기를 주면 inset 이 무시된다. */
const Layer = ({ src, box, className }: { src: string; box: Box; className?: string }) => (
  <div className={`absolute ${className ?? ''}`} style={box}>
    <img src={src} alt="" className="block h-full w-full max-w-none" />
  </div>
)

interface DialogBoxProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  children: ReactNode
}

export const DialogBox = ({ children, className, ...props }: DialogBoxProps) => (
  <div
    className={`relative drop-shadow-dialog ${className ?? ''}`}
    style={{ width: WIDTH, height: HEIGHT }}
    {...props}
  >
    <div
      className="absolute border-[1.447px] border-icing bg-crust"
      style={{ top: '78.07%', left: '0.93%', right: '0.93%', bottom: 0 }}
    />
    <div
      className="absolute border-[2.894px] border-icing bg-icing"
      style={{ top: '14.4%', left: '1%', right: '0.86%', bottom: '19.52%' }}
    />

    {/* 본문 배경 점 장식. Figma 가 5덩어리로 내보낸 것을 하나로 합쳤다. */}
    <Layer
      src="/img/dialog/dots.svg"
      box={{ top: '35.64%', right: '3.24%', bottom: '28.51%', left: '5.98%' }}
    />

    <Layer
      src="/img/dialog/top-edge.svg"
      box={{ top: '14.11%', right: '0', bottom: '71.5%', left: '0' }}
    />

    {/*
      크림 아래 그림자(Figma: 0 / 5.79 / blur 9.12 / #E3DED2).
      노드 이펙트라 SVG 로 내보내지지 않아 CSS 로 건다. 루트의 drop-shadow 로는 나오지 않는다 —
      필터는 바깥 실루엣에만 그림자를 그리는데 크림 아랫면은 박스 내부다.
      11개에 각각 걸지 않고 묶어서 한 번만 건다. 필터 패스가 11번 돌 이유가 없다.
    */}
    <div className="absolute inset-0 drop-shadow-cream">
      {CREAM.map((box) => (
        <Layer key={box.left} src="/img/dialog/cream.svg" box={box} />
      ))}
    </div>

    <div
      className="absolute flex flex-col justify-center text-center text-body text-cocoa"
      style={{
        top: '37.52%',
        left: '19.34%',
        right: '19.26%',
        bottom: '31.46%',
        lineHeight: '49.198px',
        textShadow: 'var(--text-shadow-soft)',
      }}
    >
      {children}
    </div>

    {STARS.map((box) => (
      <Layer key={box.left} src="/img/dialog/star.svg" box={box} />
    ))}
  </div>
)
