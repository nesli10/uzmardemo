import * as React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormControl, FormLabel } from "@mui/material";
import { selectTreeState } from "../store/treeSlice";
import { addTree } from "../store/treeSlice";
import { useDispatch, useSelector } from "react-redux";

export default function TreeviewForm() {
  const dispatch = useDispatch();
  const selectedTreeItem = useSelector(selectTreeState);
  const [label, setLabel] = React.useState("");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/trees", {
      method: "POST",
      body: JSON.stringify({ label, parentId: selectedTreeItem?.id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("Veri başarıyla kaydedildi.");
    } else {
      console.error("Veri kaydedilirken bir hata oluştu.");
    }
    dispatch(
      addTree({
        label,
      })
    );
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
