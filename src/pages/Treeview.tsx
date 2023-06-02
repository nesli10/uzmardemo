import * as React from "react";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { selectTreeState } from "../store/treeSlice";
import { useSelector } from "react-redux";
import { setSelected } from "../store/treeSlice";
import { useDispatch } from "react-redux";

function renderTree(nodes: any) {
  if (nodes)
    return (
      <TreeItem key={nodes.id} nodeId={nodes.id.toString()} label={nodes.label}>
        {Array.isArray(nodes.children)
          ? nodes.children.map((node: any) => renderTree(node))
          : null}
      </TreeItem>
    );
}

export default function Treeview() {
  const dispatch = useDispatch();
  const treeData = useSelector(selectTreeState);
  const handleChange = (event: any, treeData: any) => {
    dispatch(
      setSelected({
        selected: treeData,
      })
    );
  };
  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
      onNodeSelect={handleChange}
    >
      {renderTree(treeData)}
    </TreeView>
  );
}
