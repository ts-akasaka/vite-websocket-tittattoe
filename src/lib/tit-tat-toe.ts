import { DeepReadonly } from 'utility-types';

/**
 * 3 x 3 の盤面と状態。
 * 0は左上、2が右上、4が中央、8が右下とする。
 */
export type TTTSide = "O" | "X";
export type TTTBoard = (TTTSide | null)[];

/**
 * 盤面上、〇または×の数マスが揃った状態ならば真を返す。
 * @param brd 盤面
 * @param side 先手(true)、後手: false
 * @returns 揃った状態ならばtrue、そうでなければfalse
 */
export const isTTTBoardWon = (brd: DeepReadonly<TTTBoard>, side: TTTSide): boolean => {
  return (
    [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // 縦
      [0, 4, 8], [2, 4, 6] // 斜め
    ].some(set => set.every(idx => brd[idx] === side))
  );
};

/**
 * 盤面上で、すでに打たれた手数を数える。
 * @param brd 
 * @returns 手数
 */
export const countHandsOnTTTBoard = (brd: DeepReadonly<TTTBoard>) => {
  return brd.filter(v => v !== null).length;
};

/**
 * 盤面の指定位置の値をセットした結果を、新しい盤面として返す。
 * @param brd 盤面
 * @param x 横位置(左から、0-2)
 * @param y 縦位置(上から、0-2)
 * @param value セットする値（true/false/null)
 * @returns 値をセットした結果の盤面（新規生成した配列）。
 */
export const setValueOnTTTBoard = (brd: DeepReadonly<TTTBoard>, x: number, y: number, value: TTTSide | null): TTTBoard => {
  const pos = (y * 3) + x;
  return brd.map((v, idx) => idx === pos ? value : v);
}

/**
 * 盤面の指定位置の値を返す。位置が正しくない場合、例外を生成する。
 * @param brd 盤面
 * @param x 横位置(左から、0-2)
 * @param y 縦位置(上から、0-2)
 * @returns 得られた値（true/false/null)
 */
export const getValueOnTTTBoard = (brd: DeepReadonly<TTTBoard>, x: number, y: number): TTTSide | null => {
  const pos = (y * 3) + x;
  if (!(pos in brd)) {
    throw new Error(`No square of (${x}, ${y}) on the board`);
  }
  return brd[pos];
}

/**
 * 初期の盤面（全て空）を返す。
 * @returns 新規生成された盤面
 */
export const createInitialTTTBoard = (): TTTBoard => {
  return Array.from({ length: 9 }, () => null);
};
