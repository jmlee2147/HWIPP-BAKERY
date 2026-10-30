import { z } from "zod";
import {
  CAKE_COLORS,
  CAKE_DECORATIONS,
  CAKE_SHAPES,
  CAKE_SIZES,
  type CakeConfig,
} from "@/data/cake";
import { CAKE_PRESETS } from "@/data/cakePresets";
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
        rotate: z.number().optional(),
      }),
    )
    .optional(),
  manual: z.boolean().optional(),
  group: z.string().optional(),
});

type Decoration = CakeConfig["decorations"][number];
type PackedDecoration = string | (string | number | null)[] | Decoration;
const PLAIN_KEYS = ["id", "x", "y", "scale", "rotate", "flip"];
type At = NonNullable<Decoration["at"]>[keyof NonNullable<Decoration["at"]>];
const AT_KEYS = ["x", "y", "scale", "rotate", "under", "over"];

// 주소를 줄이려고 장식을 짧게 담는다. 자리가 정해진 장식은 id만, 자리를 준 장식은 [id, x, y, 배율, 기울기, 뒤집기] 배열로 담는다.
// 지금 모양의 자리를 따로 적은 장식은 그 뒤에 [x, y, 배율, 기울기, 깔기(1)·얹기(2)]를 붙인다.
// 좌표와 기울기는 정수로 줄인다. 그 밖의 값이 있는 장식만 그대로 담는다.
function packDecoration(item: Decoration, shape: string): PackedDecoration {
  const keys = Object.keys(item).filter(
    (key) => item[key as keyof Decoration] !== undefined,
  );
  if (keys.length === 1) return item.id;
  const at = item.at?.[shape as keyof typeof item.at];
  const atOnly =
    item.at !== undefined &&
    Object.keys(item.at).length === 1 &&
    at !== undefined &&
    Object.keys(at).every((key) => AT_KEYS.includes(key));
  const plain = keys.every(
    (key) => PLAIN_KEYS.includes(key) || (key === "at" && atOnly),
  );
  if (!plain || (!atOnly && (item.x === undefined || item.y === undefined))) {
    return item;
  }
  const round = (value: number | undefined) =>
    value === undefined ? null : Math.round(value);
  const packed: (string | number | null)[] = [
    item.id,
    round(item.x),
    round(item.y),
    item.scale ?? null,
    round(item.rotate),
    item.flip ? 1 : null,
  ];
  if (at) {
    packed.push(
      Math.round(at.x),
      Math.round(at.y),
      at.scale ?? null,
      round(at.rotate),
      at.under ? 1 : at.over ? 2 : null,
    );
  }
  while (packed[packed.length - 1] === null) packed.pop();
  return packed;
}

function unpackDecoration(
  packed: PackedDecoration,
  shape: string,
): Decoration | null {
  if (typeof packed === "string") return { id: packed };
  if (!Array.isArray(packed)) return packed;
  const [id, x, y, scale, rotate, flip, ax, ay, aScale, aRotate, layer] =
    packed;
  if (typeof id !== "string") return null;
  const hasAt = typeof ax === "number" && typeof ay === "number";
  if (!hasAt && (typeof x !== "number" || typeof y !== "number")) return null;
  const at: At | undefined = hasAt
    ? {
        x: ax,
        y: ay,
        ...(typeof aScale === "number" ? { scale: aScale } : {}),
        ...(typeof aRotate === "number" ? { rotate: aRotate } : {}),
        ...(layer === 1 ? { under: true } : layer === 2 ? { over: true } : {}),
      }
    : undefined;
  return {
    id,
    ...(typeof x === "number" ? { x } : {}),
    ...(typeof y === "number" ? { y } : {}),
    ...(typeof scale === "number" ? { scale } : {}),
    ...(typeof rotate === "number" ? { rotate } : {}),
    ...(flip === 1 ? { flip: true } : {}),
    ...(at ? { at: { [shape]: at } } : {}),
  };
}

const packedSchema = z.union([
  z.string(),
  z
    .array(z.union([z.string(), z.number(), z.null()]))
    .min(1)
    .max(11),
  decorationSchema,
]);

const cakeSchema = z
  .object({
    size: z.enum(ids(CAKE_SIZES)),
    shape: shapeId,
    color: z.enum(ids(CAKE_COLORS)),
    decorations: z.array(packedSchema).max(400).optional(),
    // 장식을 손대지 않은 완성 케이크 예시는 장식 대신 예시 id만 담는다.
    p: z.string().optional(),
    layoutShape: shapeId.optional(),
    shift: z.partialRecord(shapeId, point).optional(),
  })
  // 짧게 담은 장식은 케이크 모양을 알아야 되돌릴 수 있다. 없는 장식이 섞여 와도 케이크는 그리고, 모르는 장식만 버린다.
  .transform(({ p, ...cake }) => ({
    ...cake,
    decorations: p
      ? (CAKE_PRESETS.find((preset) => preset.id === p)?.cake.decorations ?? [])
      : (cake.decorations ?? [])
          .map((item) => unpackDecoration(item, cake.shape))
          .filter(
            (item): item is Decoration =>
              item !== null && decorationIds.has(item.id),
          ),
  }));

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
// 공유 페이지는 케이크를 지금 모양으로만 그린다. 다른 모양에서만 쓰는 장식과 자리는 빼서 주소를 줄인다.
// 그리는 결과는 같다. 다른 모양에서만 그리는 장식은 그릴 때 처음부터 없는 것으로 치고, 모양별 자리는 그 모양의 것만 쓴다.
export function forCurrentShape(cake: CakeConfig): CakeConfig {
  const { shape } = cake;
  return {
    ...cake,
    decorations: cake.decorations
      .filter((item) => !item.only || item.only.includes(shape))
      .map(({ only: _only, ...item }) => {
        if (!item.at) return item;
        const { at, ...rest } = item;
        const own = at[shape];
        return own ? { ...rest, at: { [shape]: own } } : rest;
      }),
  };
}

export async function encodeSharedCake(shared: SharedCake): Promise<string> {
  const { party, style, relation, flavor } = shared.answers;
  const cake = forCurrentShape(shared.cake);
  const decorations = JSON.stringify(shared.cake.decorations);
  const preset = CAKE_PRESETS.find(
    (one) => JSON.stringify(one.cake.decorations) === decorations,
  );
  const json = JSON.stringify({
    c: preset
      ? { ...cake, decorations: undefined, p: preset.id }
      : {
          ...cake,
          decorations: cake.decorations.map((item) =>
            packDecoration(item, cake.shape),
          ),
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
