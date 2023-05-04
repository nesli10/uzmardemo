import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

export interface treeDataItem {
  label: String;
  id: string;
  parentId?: string;
  children?: Array<treeDataItem>;
}

interface initialStateInterface {
  treeData?: treeDataItem;
  selected: any;
}
// Initial state
const initialState: initialStateInterface = {
  selected: 1,
};

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
      const maxId = action.payload.id;
      const findPositionAndAddItem = (state: any, id: any, label: any) => {
        if (state.hasOwnProperty("id") && state.id === id) {
          if (!state.hasOwnProperty("children")) {
            state.children = [];
          }
          state.children.push({ id: maxId, label: label });

          return state;
        }
        if (Array.isArray(state)) {
          state.map((child) => {
            return findPositionAndAddItem(child, id, label);
          });
        }
        if (state.hasOwnProperty("children")) {
          state.children = findPositionAndAddItem(state.children, id, label);
          return state;
        }
        return state;
      };
      state.treeData = findPositionAndAddItem(
        state.treeData,
        state.selected,
        action.payload.label
      );
    },
    getData: (state, action) => {
      let listedTreeData = action.payload;
      let treeData: Array<treeDataItem> = [];
      const listedDataParser = (
        node: Array<treeDataItem>,
        parentId?: string
      ) => {
        listedTreeData.forEach((element: treeDataItem) => {
          if (element.parentId === parentId) {
            node.push(element);
            element.children = [];
            listedDataParser(element.children, element.id);
          }
        });
      };
      listedDataParser(treeData);
      console.log(treeData[0]);
      state.treeData = treeData[0];
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

export const { addTree, setSelected, getData } = treeSlice.actions;
export const selectTreeState = (state: AppState) => state.tree.treeData;
export const selectedTreeState: any = (state: AppState) => state.tree.selected;
export default treeSlice.reducer;
