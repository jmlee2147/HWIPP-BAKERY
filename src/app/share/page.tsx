import { Stage } from "@/components/common/Stage/Stage";
import { SharedCakeView } from "@/components/share/SharedCakeView/SharedCakeView";

// 키오스크의 QR 코드로 여는 페이지. 케이크 구성은 주소의 # 뒤에 담겨 와서, 서버는 빈 페이지만 내려준다.
export default function SharePage() {
  return (
    <Stage>
      <SharedCakeView />
    </Stage>
  );
}
