import { call, put, takeLatest } from "redux-saga/effects";
import { addTree } from "./treeSlice";

const getTrees = () => {
  return fetch("http://localhost:3000/api/trees")
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};

function* getTreesSaga() {
  const { response, error } = yield call(getTrees);
  if (response) {
    const data = yield response.json();
    yield put({ type: "addTree", payload: data });
  } else {
    console.log("error: ", error.message);
    //yield put({ type: 'GET_USERS_FAILED', message: error.message })
  }
}

export default function* treeSaga() {
  yield [takeLatest("tree/addTree", getTreesSaga)];
}
