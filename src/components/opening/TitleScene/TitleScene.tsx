import { LogoEmblem } from "@/components/common/LogoEmblem/LogoEmblem";
import { LogoPlate } from "@/components/common/LogoPlate/LogoPlate";
import { Sticker } from "@/components/common/Sticker/Sticker";
import { TITLE_STICKERS } from "@/data/stickers";

const asset = (name: string) => `/assets/title/${name}`;
const layer = "absolute block max-w-none";

// 상단 띠의 케이크 크기 안내.
const SIZE_GUIDE = [
  {
    src: "size-1.svg",
    className: "left-[37.94px] top-[30px] h-[70.81px] w-[90.51px]",
  },
  {
    src: "size-1-text.svg",
    className: "left-[37px] top-[118px] h-[13.79px] w-[91.6px]",
  },
  {
    src: "size-2.svg",
    className: "left-[156.18px] top-[30px] h-[70.81px] w-[74.68px]",
  },
  {
    src: "size-2-text.svg",
    className: "left-[149.86px] top-[118px] h-[13.79px] w-[91.6px]",
  },
  {
    src: "size-heart.svg",
    className: "left-[258.6px] top-[33.83px] h-[68.66px] w-[82px]",
  },
  {
    src: "size-heart-text.svg",
    className: "left-[272.07px] top-[119.94px] h-[13.5px] w-[61.63px]",
  },
];

// 점무늬 종이. 엇갈린 두 겹의 점을 배경으로 그린다.
const PAPER =
  "absolute rounded-b-[9.45px] bg-white bg-[radial-gradient(circle,#dcdcdc_3.2px,transparent_3.8px),radial-gradient(circle,#dcdcdc_3.2px,transparent_3.8px)]";

const TAG = "absolute h-[40.59px] border-[0.68px] border-cocoa bg-blush";

const PLUS_ONES = [
  {
    star: "left-[651.9px] top-[1299.1px] size-[34.11px]",
    text: "left-[690.32px] top-[1303.78px] text-[23.51px]",
  },
  {
    star: "left-[656.51px] top-[1335.32px] size-[29.48px]",
    text: "left-[689.72px] top-[1339.37px] text-[20.32px]",
  },
  {
    star: "left-[665.97px] top-[1368.86px] size-[19.99px]",
    text: "left-[688.5px] top-[1371.61px] text-[13.78px]",
  },
];

// 왼쪽 날개는 오른쪽 날개를 좌우로 뒤집은 것이다.
const WINGS = [
  "left-[682.72px] top-[1393.8px] rotate-[23.5deg]",
  "left-[383.47px] top-[1377.34px] [transform:rotate(-14.14deg)_scaleX(-1)]",
];

const Stickers = ({ name }: { name: keyof typeof TITLE_STICKERS }) =>
  TITLE_STICKERS[name].map((sticker) => (
    <Sticker key={`${sticker.centerX}-${sticker.centerY}`} sticker={sticker} />
  ));

const HeartBadge = ({ className }: { className: string }) => (
  <div
    className={`absolute flex size-[44.53px] items-center justify-center rounded-full border-[0.96px] border-[#867b76] bg-mint font-stardust text-[26px] leading-none text-cocoa ${className}`}
  >
    ♥
  </div>
);

const Label = ({ name, className }: { name: string; className: string }) => (
  <img
    alt=""
    className={`${layer} ${className}`}
    src={asset(`label-${name}`)}
  />
);

interface TitleSceneProps {
  onStart: () => void;
}

export const TitleScene = ({ onStart }: TitleSceneProps) => {
  return (
    <section className="absolute inset-0 overflow-hidden bg-[#c8a7a1]">
      <img
        alt=""
        className={`${layer} left-[-277px] top-[153px] h-[1898px] w-[1634px] object-cover opacity-[0.594]`}
        src={asset("background.jpg")}
      />

      <div className="absolute left-0 top-0 h-[163px] w-full bg-cream" />
      <div className="absolute left-0 top-[152.96px] h-[10.04px] w-full bg-[#e2e2e2]" />
      {SIZE_GUIDE.map((item) => (
        <img
          key={item.src}
          alt=""
          className={`${layer} ${item.className}`}
          src={asset(item.src)}
        />
      ))}

      <div className="absolute left-[50.59px] top-[304.43px] h-[1408.37px] w-[974.83px] bg-cocoa" />
      <div className="absolute left-[89.14px] top-[338.45px] h-[1330.27px] w-[897.73px] border-[1.02px] border-[#c2c2c2] bg-[#e2e2e2]" />
      <div className="absolute left-[103.66px] top-[403.57px] h-[407.35px] w-[868.99px] bg-[#fdfcf9]" />
      <div
        className={`${PAPER} left-[103.53px] top-[352.61px] h-[458.32px] w-[868.99px] [background-position:-21.73px_-15.47px,5px_9.66px] [background-size:53.79px_50.25px]`}
      />
      <div
        className={`${PAPER} left-[103.75px] top-[1237.16px] h-[415.53px] w-[868.77px] [background-position:11.01px_-14.35px,-14.11px_8.97px] [background-size:49.93px_46.64px]`}
      />

      <Stickers name="strawberryShortcake" />
      <div
        className={`${TAG} left-[184.19px] top-[695.89px] w-[150.67px] opacity-70`}
      />
      <div className={`${TAG} left-[488.04px] top-[425.85px] w-[189.21px]`} />
      <div
        className={`${TAG} left-[259.16px] top-[735.88px] w-[108.86px] opacity-70`}
      />
      <Label
        name="strawberry-shortcake.svg"
        className="left-[195.3px] top-[707.8px] h-[16.69px] w-[128.47px]"
      />
      <Label
        name="cherry-choco.svg"
        className="left-[508.5px] top-[436.5px] h-[19.24px] w-[148.29px]"
      />
      <Label
        name="rating.png"
        className="left-[270px] top-[746.7px] h-[22px] w-[96px]"
      />

      <img
        alt=""
        className={`${layer} left-[538.03px] top-[393.13px] h-[248.86px] w-[199.89px]`}
        src={asset("cherry.svg")}
      />

      <Stickers name="cherryChoco" />

      <img
        alt=""
        className={`${layer} left-[165.44px] top-[1259.87px] h-[393.11px] w-[737.27px]`}
        src={asset("awning.svg")}
      />

      <HeartBadge className="left-[184.01px] top-[1278.96px]" />
      <HeartBadge className="left-[226.7px] top-[1304.1px]" />
      <Stickers name="heartChoco" />
      <div
        className={`${TAG} left-[30px] top-[1310.6px] w-[167.31px] opacity-70`}
      />
      <Stickers name="kiwiMango" />
      {WINGS.map((wing) => (
        <div key={wing} className={`absolute h-[71.57px] w-[56.61px] ${wing}`}>
          <img
            alt=""
            className={`${layer} left-[-5.36px] top-[-1.34px] h-[93.03px] w-[78.06px]`}
            src={asset("wing.svg")}
          />
        </div>
      ))}
      <Stickers name="angelRoll" />
      <div
        className={`${TAG} left-[590.77px] top-[1640.44px] w-[150.67px] opacity-70`}
      />
      <div
        className={`${TAG} left-[751.2px] top-[1272px] w-[163.3px] opacity-70`}
      />
      <Label
        name="heart-choco.svg"
        className="left-[43.3px] top-[1322.9px] h-[16.57px] w-[140.73px]"
      />
      <Label
        name="angel-roll.svg"
        className="left-[604.5px] top-[1652.4px] h-[16.33px] w-[122.12px]"
      />
      <Label
        name="kiwi-mango.svg"
        className="left-[763.6px] top-[1285.8px] h-[16px] w-[137.8px]"
      />
      <Stickers name="chocoBerry" />
      <HeartBadge className="left-[809.8px] top-[700px]" />
      <div
        className={`${TAG} left-[742.12px] top-[744.55px] w-[179.79px] opacity-70`}
      />
      {PLUS_ONES.map((item) => (
        <div key={item.star}>
          <img
            alt=""
            className={`${layer} ${item.star}`}
            src={asset("star.svg")}
          />
          <span
            className={`absolute whitespace-nowrap font-stardust leading-none tracking-[-0.04em] text-cocoa ${item.text}`}
          >
            +1
          </span>
        </div>
      ))}
      <img
        alt=""
        className={`${layer} left-[375.57px] top-[112px] size-[324.87px]`}
        src={asset("clip.png")}
      />

      <LogoPlate className="absolute left-[124.05px] top-[820.68px]" />
      <LogoEmblem className="absolute left-[239px] top-[833px]" />
      <Label
        name="choco-berry.svg"
        className="left-[761.4px] top-[756.4px] h-[16.9px] w-[139.98px]"
      />

      <img
        alt=""
        className={`${layer} left-[867.73px] top-[95.05px] h-[31.37px] w-[146.22px]`}
        src="/assets/logo/bakery-dots-outline.svg"
      />
      <img
        alt=""
        className={`${layer} left-[834px] top-[23px] h-[67.76px] w-[211.11px]`}
        src="/assets/logo/hwipp-outline.svg"
      />

      <button
        type="button"
        className="absolute left-[172px] top-[1774px] h-[83px] w-[734.6px] group transition-transform duration-100 active:translate-y-[4px] active:scale-[0.95]"
        onClick={onStart}
      >
        <span className="absolute inset-0 rounded-[9.14px] bg-[#f2f2f2] opacity-[0.49] shadow-[-0.73px_1.1px_21.41px_0px_rgba(255,255,255,0.63)]" />
        <span className="absolute inset-x-[6.92px] inset-y-[3.58px] rounded-[9.14px] border-[0.37px] border-[#909090] bg-petal opacity-[0.49] shadow-[inset_4.02px_-3.19px_22.84px_0px_rgba(255,255,255,0.47)] transition-opacity duration-100 group-active:opacity-90" />
        <span className="absolute inset-0 flex items-center justify-center font-meow text-[25.56px] tracking-[0.18em] text-[#5e3e23] [-webkit-text-stroke:0.48px_#5e3e23]">
          START!
        </span>
      </button>
    </section>
  );
};
