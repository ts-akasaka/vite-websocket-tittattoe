import { z } from 'zod';

// Zod定義、ステートを更新する関数を引数に取り、Redux ToolkitのcreateSliceにreducerとして与える関数を生成する。
// アクションの実行時、その内容は検証され、エラーがあれば例外が発生する。
// Note: zaction<State>((state, payload) => {...]})という書き方をしたいが、現状は無理。
// https://github.com/microsoft/TypeScript/issues/10571
export const zaction = <T, U extends z.ZodType<any>>(
  ztype: U, fn: (state: T, payload: z.infer<U>) => any
): ((state: T, data: { type: string, payload: z.infer<U> }) => any) => {
  return (state: T, data: any) => {
    const payload = ztype.parse("payload" in data ? data["payload"] : undefined);
    return fn(state, payload);
  };
};

