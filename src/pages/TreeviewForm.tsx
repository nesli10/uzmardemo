import * as React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormControl, FormLabel } from "@mui/material";
import { selectedTreeState } from "../store/treeSlice";
import { useDispatch, useSelector } from "react-redux";

export default function TreeviewForm() {
  const dispatch = useDispatch();
  const selectedTreeItem = useSelector(selectedTreeState);
  const [label, setLabel] = React.useState("");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({
      type: "POST_TREE",
      label,
      selectedTreeItem,
    });
    setLabel("");
  };

  return (
    <FormControl component="form" onSubmit={handleSubmit}>
      <FormLabel></FormLabel>
      <TextField
        size="small"
        style={{ width: 150 }}
        name="veri"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      ></TextField>
      <Button type="submit">Ekle</Button>
    </FormControl>
  );
}
