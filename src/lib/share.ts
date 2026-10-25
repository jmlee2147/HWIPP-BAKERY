import { z } from "zod";
import {
  CAKE_COLORS,
  CAKE_DECORATIONS,
  CAKE_SHAPES,
  CAKE_SIZES,
  type CakeConfig,
} from "@/data/cake";
import type { FlavorId } from "@/data/flavors";
import { FLAVORS } from "@/data/flavors";
import type { PartyId } from "@/data/parties";
import { PARTIES } from "@/data/parties";
import type { RelationId } from "@/data/relations";
import { RELATIONS } from "@/data/relations";
import type { StyleId } from "@/data/styles";
import { STYLES } from "@/data/styles";

// 휴대폰에서 여는 공유 페이지에 넘기는 내용. 서버에 저장하지 않고 주소에 담는다.
export interface SharedCake {
  cake: CakeConfig;
  answers: {
    party: PartyId | null;
    style: StyleId | null;
    relation: RelationId | null;
    flavor: FlavorId | null;
  };
  date: string;
  orderNumber: number;
}

export const SHARE_PATH = "/share";
// 주소의 # 뒤에 담는다. # 뒤는 서버로 가지 않아 공유 페이지를 정적 파일 하나로 둘 수 있다.
const HASH_KEY = "c=";

const ids = <T extends { id: string }>(list: readonly T[]) =>
  list.map((item) => item.id) as [T["id"], ...T["id"][]];

const shapeId = z.enum(ids(CAKE_SHAPES));
const point = z.object({ x: z.number(), y: z.number() });
const decorationIds = new Set(CAKE_DECORATIONS.map((item) => item.id));

const decorationSchema = z.object({
  id: z.string(),
  x: z.number().optional(),
  y: z.number().optional(),
  scale: z.number().optional(),
  rotate: z.number().optional(),
  flip: z.boolean().optional(),
  only: z.array(shapeId).optional(),
  at: z
    .partialRecord(
      shapeId,
      point.extend({
        under: z.boolean().optional(),
        over: z.boolean().optional(),
        scale: z.number().optional(),
      }),
    )
    .optional(),
  manual: z.boolean().optional(),
  group: z.string().optional(),
});

type Decoration = CakeConfig["decorations"][number];
type PackedDecoration = string | (string | number | null)[] | Decoration;
const PLAIN_KEYS = ["id", "x", "y", "scale", "rotate", "flip"];

// 주소를 줄이려고 장식을 짧게 담는다. 자리가 정해진 장식은 id만, 자리를 준 장식은 [id, x, y, 배율, 기울기, 뒤집기] 배열로 담는다.
// 좌표와 기울기는 정수로 줄인다. 모양별 자리처럼 다른 값이 있는 장식만 그대로 담는다.
function packDecoration(item: Decoration): PackedDecoration {
  const keys = Object.keys(item).filter(
    (key) => item[key as keyof Decoration] !== undefined,
  );
  if (keys.length === 1) return item.id;
  if (
    item.x === undefined ||
    item.y === undefined ||
    !keys.every((key) => PLAIN_KEYS.includes(key))
  ) {
    return item;
  }
  const packed = [
    item.id,
    Math.round(item.x),
    Math.round(item.y),
    item.scale ?? null,
    item.rotate === undefined ? null : Math.round(item.rotate),
    item.flip ? 1 : null,
  ];
  while (packed[packed.length - 1] === null) packed.pop();
  return packed;
}

function unpackDecoration(packed: PackedDecoration): Decoration | null {
  if (typeof packed === "string") return { id: packed };
  if (!Array.isArray(packed)) return packed;
  const [id, x, y, scale, rotate, flip] = packed;
  if (
    typeof id !== "string" ||
    typeof x !== "number" ||
    typeof y !== "number"
  ) {
    return null;
  }
  return {
    id,
    x,
    y,
    ...(typeof scale === "number" ? { scale } : {}),
    ...(typeof rotate === "number" ? { rotate } : {}),
    ...(flip === 1 ? { flip: true } : {}),
  };
}

const packedSchema = z.union([
  z.string(),
  z
    .array(z.union([z.string(), z.number(), z.null()]))
    .min(3)
    .max(6),
  decorationSchema,
]);

const cakeSchema = z.object({
  size: z.enum(ids(CAKE_SIZES)),
  shape: shapeId,
  color: z.enum(ids(CAKE_COLORS)),
  // 없는 장식이 섞여 와도 케이크는 그린다. 모르는 장식만 버린다.
  decorations: z
    .array(packedSchema)
    .max(400)
    .transform((list) =>
      list
        .map(unpackDecoration)
        .filter(
          (item): item is Decoration =>
            item !== null && decorationIds.has(item.id),
        ),
    ),
  layoutShape: shapeId.optional(),
  shift: z.partialRecord(shapeId, point).optional(),
});

const answer = <T extends { id: string }>(list: readonly T[]) =>
  z.enum(ids(list)).nullable();

// 주소가 짧을수록 QR 코드의 칸이 굵어져 잘 찍힌다. 그래서 키를 한 글자로 줄여 담는다.
const payloadSchema = z.object({
  c: cakeSchema,
  a: z.tuple([
    answer(PARTIES),
    answer(STYLES),
    answer(RELATIONS),
    answer(FLAVORS),
  ]),
  d: z.string().max(10),
  n: z.number().int().min(1).max(999),
});

async function transform(
  bytes: Uint8Array<ArrayBuffer>,
  stream: CompressionStream | DecompressionStream,
): Promise<Uint8Array> {
  const source = new ReadableStream<BufferSource>({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
  });
  const output = source.pipeThrough(stream);
  return new Uint8Array(await new Response(output).arrayBuffer());
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(text: string): Uint8Array<ArrayBuffer> {
  const binary = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

// 케이크와 답변을 압축해 주소의 # 뒤에 붙일 문자열로 만든다.
export async function encodeSharedCake(shared: SharedCake): Promise<string> {
  const { party, style, relation, flavor } = shared.answers;
  const json = JSON.stringify({
    c: {
      ...shared.cake,
      decorations: shared.cake.decorations.map(packDecoration),
    },
    a: [party, style, relation, flavor],
    d: shared.date,
    n: shared.orderNumber,
  });
  const bytes = await transform(
    new TextEncoder().encode(json),
    new CompressionStream("deflate"),
  );
  return `${HASH_KEY}${toBase64Url(bytes)}`;
}

export async function shareUrl(
  origin: string,
  shared: SharedCake,
): Promise<string> {
  return `${origin}${SHARE_PATH}#${await encodeSharedCake(shared)}`;
}

// 주소의 # 뒤 문자열을 되돌린다. 잘리거나 손댄 주소면 null을 돌려준다.
export async function decodeSharedCake(
  hash: string,
): Promise<SharedCake | null> {
  const text = hash.replace(/^#/, "");
  if (!text.startsWith(HASH_KEY)) return null;
  try {
    const bytes = await transform(
      fromBase64Url(text.slice(HASH_KEY.length)),
      new DecompressionStream("deflate"),
    );
    const parsed = payloadSchema.safeParse(
      JSON.parse(new TextDecoder().decode(bytes)),
    );
    if (!parsed.success) return null;
    const { c, a, d, n } = parsed.data;
    return {
      cake: c,
      answers: { party: a[0], style: a[1], relation: a[2], flavor: a[3] },
      date: d,
      orderNumber: n,
    };
  } catch {
    return null;
  }
}
