import { createSlice } from '@reduxjs/toolkit'
import { zaction } from 'store/utils';
import { z } from 'zod';

// ---------- [ State ] -------------
const RoleZ = z.enum(["O", "X", "A"]).or(z.literal(null));

const StateZ = z.object({
  value: RoleZ,
});

type State = z.infer<typeof StateZ>;

const initialState: State = {
  value: null,
};

// ---------- [ Actions ] -------------

const updateRole = zaction(
  RoleZ,
  (state: State, payload) => {
    state.value = payload;
  }
);

// ---------- [ Slice ] -------------
export default createSlice({
  name: "role",
  initialState,
  reducers: {
    updateRole
  },
});
