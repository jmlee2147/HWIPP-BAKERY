// 장면 전환. 새 장면이 이전 장면 위에서 서서히 나타나고, 이전 장면은 그동안 그대로 남아 있다가 사라진다.
// 둘 다 투명해지는 순간이 없어서 전환 중에 빈 화면이 보이지 않는다.
export const FADE_SECONDS = 0.5;

export const coverEnter = {
  initial: { opacity: 0, zIndex: 1 },
  animate: { opacity: 1, zIndex: 1, transition: { duration: FADE_SECONDS } },
};

export const holdUntilCovered = {
  zIndex: 0,
  opacity: 0,
  transition: { opacity: { duration: 0.01, delay: FADE_SECONDS } },
};
