import { z } from 'zod';
import { createSlice } from '@reduxjs/toolkit'

import { createInitialTTTBoard } from "lib/tit-tat-toe";
import { zaction } from "store/utils";

// ---------- [ State ] -------------
const BoardZ = z.array(z.enum(["O", "X"]).or(z.literal(null))).length(9);
const StatusZ = z.enum(["Accepting", "O-Turn", "X-Turn", "O-Done", "X-Done", "O-Won", "X-Won", "Draw"]);
const AudienceZ = z.number();

const StateZ = z.object({
  board: BoardZ,
  status: StatusZ,
  audience: AudienceZ,
});

type State = z.infer<typeof StateZ>;

const initialState: State = {
  board: createInitialTTTBoard(),
  status: "Accepting",
  audience: 0,
};

// ---------- [ Actions ] -------------

const updateAll = zaction(
  StateZ,
  (state: State, payload) => {
    Object.assign(state, payload);
  }
);

const setBoard = zaction(
  BoardZ,
  (state: State, payload) => {
    state.board = payload;
  }
);

const setStatus = zaction(
  StatusZ,
  (state: State, payload) => {
    state.status = payload;
  }
);

const setAudience = zaction(
  AudienceZ,
  (state: State, payload) => {
    state.audience = payload;
  }
);

// ---------- [ Slice ] -------------
export default createSlice({
  name: "display",
  initialState,
  reducers: {
    updateAll, setBoard, setStatus, setAudience
  },
});
