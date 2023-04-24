import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, FormLabel, } from '@mui/material';
import { selectTreeState, } from "../store/treeSlice";
import {  addTree } from "../store/treeSlice";
import { useDispatch, useSelector } from "react-redux";



export default function TreeviewForm() {
    
    const dispatch = useDispatch();
    const treeData =  useSelector(selectTreeState);
    const [veri, setVeri] = React.useState('');
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(addTree({
            veri
        }));
        setVeri("");
      };
      
    //   useEffect(()=>{
    //   console.log(treeData)
    //   }, [treeData])
      
return (
<FormControl component="form" onSubmit={handleSubmit}>
    <FormLabel></FormLabel>
    <TextField size='small' style={{width:150}}
     name="veri"
     value={veri}
     onChange={(e) => setVeri(e.target.value)}
    >
    </TextField>
    <Button  type="submit">Ekle</Button>
</FormControl>
 );
}