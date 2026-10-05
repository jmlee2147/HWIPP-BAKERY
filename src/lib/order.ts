const STORAGE_KEY = "hwipp-bakery:order-number";
// 주문서의 번호 칸은 세 자리다. 999 다음은 다시 1부터 센다.
const MAX_ORDER_NUMBER = 999;

// 이 기기에서 만든 케이크의 순번을 하나 올려 돌려준다. 새로고침하거나 기기를 껐다 켜도 이어진다.
// 저장소를 쓸 수 없는 브라우저에서는 늘 1을 돌려준다.
export function nextOrderNumber(): number {
  try {
    const last = Number(window.localStorage.getItem(STORAGE_KEY));
    const next =
      Number.isInteger(last) && last >= 1 && last < MAX_ORDER_NUMBER
        ? last + 1
        : 1;
    window.localStorage.setItem(STORAGE_KEY, String(next));
    return next;
  } catch {
    return 1;
  }
}

// 순번을 주문서에 적는 모양으로 바꾼다. 7은 (007)이 된다.
export function formatOrderNumber(orderNumber: number): string {
  return `(${String(orderNumber).padStart(3, "0")})`;
}

// 기기의 시계와 시간대를 따른다.
export function formatOrderDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}.${month}.${day}`;
}
