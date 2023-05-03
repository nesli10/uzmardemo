import { call, put, takeEvery } from "redux-saga/effects";
import { getData } from "./treeSlice";

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

export default function* treeSaga() {
  yield takeEvery("GET_ALL_TREE", getTreesSaga);
}
