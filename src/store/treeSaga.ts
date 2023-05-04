import { call, put, takeEvery } from "redux-saga/effects";
import { getData } from "./treeSlice";
import { addTree } from "../store/treeSlice";

const getTrees = () => {
  return fetch("http://localhost:3000/api/trees")
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};

function* getTreesSaga(): any {
  const { response, error } = yield call(getTrees);
  if (response) {
    const data = yield response.json();
    yield put(getData(data));
  } else {
    console.log("error: ", error.message);
    //yield put({ type: 'GET_USERS_FAILED', message: error.message })
  }
}

const postTrees = (label: any, selectedTreeItem: any) => {
  return fetch("http://localhost:3000/api/trees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ label, parentId: selectedTreeItem }),
  })
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};

function* postTreesSaga(action: any): any {
  const { label, selectedTreeItem } = action;
  const { response, error } = yield call(postTrees, label, selectedTreeItem);
  if (response) {
    const data = yield response.json();
    const treeData = {
      label: label,
      selectedTreeItem: selectedTreeItem,
      id: data.id,
    };
    yield put(addTree(treeData));
  } else {
    console.log("error: ", error.message);
    //yield put({ type: 'GET_USERS_FAILED', message: error.message })
  }
}

export default function* treeSaga() {
  yield takeEvery("GET_ALL_TREE", getTreesSaga);
  yield takeEvery("POST_TREE", postTreesSaga);
}
