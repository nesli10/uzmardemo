import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

export interface treeDataItem {
  label: String,
  id: Number,
  children?: Array<treeDataItem>
}

interface initialStateInterface {
  treeData: treeDataItem,
  selected: any,
  maxId: any
}
// Initial state
const initialState : initialStateInterface  = {
  treeData:{
    label: "Main",
    id:1,
    children :[
      {label: "Sub Menu 2", id: 2,children :[
        {label: "Sub Menu 4", id: 4},
        {label: "Sub Menu 5", id: 5},
      ]},
      {label: "Sub Menu", id: 3},
    ]
  },
  selected: 1,
  maxId: 5
}

  
// Actual Slice
export const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    setSelected: (state, action) => {
      state.selected = action.payload.selected;
    },
      // Action to add tree
    addTree: (state, action) => {
      const maxId = state.maxId+1;
      state.maxId = maxId;
      const findPositionAndAddItem = (state:any, id:any, label:any) => {
        if (state.hasOwnProperty('id') && state.id === id) {
            if (!state.hasOwnProperty('children')){
              state.children = [];
            }
            state.children.push({id : maxId, label: label});
            
            return state;
        }
        if (Array.isArray(state)) {
          state.map((child) => {
                return findPositionAndAddItem(child, id, label);
            })
        }
        if (state.hasOwnProperty('children')) {
          state.children = findPositionAndAddItem(state.children, id, label);
            return state;
        }
        return state;
    };
    state.treeData = findPositionAndAddItem(state.treeData,state.selected,action.payload.veri);

    },
  },
  
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.tree,
      };
    },
  },
});


export const { addTree,setSelected } = treeSlice.actions;
export const selectTreeState = (state: AppState) => state.tree.treeData;
export default treeSlice.reducer;