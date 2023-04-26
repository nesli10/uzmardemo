import * as React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormControl, FormLabel } from "@mui/material";
import { selectTreeState } from "../store/treeSlice";
import { addTree } from "../store/treeSlice";
import { useDispatch, useSelector } from "react-redux";

export default function TreeviewForm() {
  const dispatch = useDispatch();
  const treeData = useSelector(selectTreeState);
  const [veri, setVeri] = React.useState("");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Form verisini API rotasına gönder
    //     const response = await fetch('/api/trees', {
    //     method: 'POST',
    //     body: JSON.stringify({ veri}),
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   });

    //   if (response.ok) {
    //     console.log('Veri başarıyla kaydedildi.');
    //   } else {
    //     console.error('Veri kaydedilirken bir hata oluştu.');
    //   }
    dispatch(
      addTree({
        veri,
      })
    );
    setVeri("");
  };

  return (
    <FormControl component="form" onSubmit={handleSubmit}>
      <FormLabel></FormLabel>
      <TextField
        size="small"
        style={{ width: 150 }}
        name="veri"
        value={veri}
        onChange={(e) => setVeri(e.target.value)}
      ></TextField>
      <Button type="submit">Ekle</Button>
    </FormControl>
  );
}
