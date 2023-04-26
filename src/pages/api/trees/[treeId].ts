import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

// Veri kaydedilecek JSON dosyasının yolu
const filePath = path.join(process.cwd(), "tree.json");

// Veri kaydetme işlemini gerçekleştiren API rotası
const saveDataApiRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  // JSON dosyasından veriyi oku
  if (req.method === "GET") {
    const fileData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileData);
    const returnData: any = [];
    data.map((obj: any, id: number) => {
      if (obj.id === req.query.treeId) {
        returnData.push(obj);
      }
    });

    res.status(200).json(returnData);
  } else if (req.method === "PUT") {
    try {
      const fileData = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(fileData);
      const updatedData: any = data.map((obj: any, id: number) => {
        if (obj.id === req.query.treeId) {
          const { label, children, ...rest } = req.body;
          return { ...obj, label, children, ...rest };
        } else {
          return obj;
        }
      });
      fs.writeFileSync(filePath, JSON.stringify(updatedData), "utf-8");
      res.status(200).json({ message: "veri başarıyla güncellendi" });
    } catch (error) {
      res.status(500).json({ message: "veri güncellenirken hat oldu" });
    }
  } else if (req.method === "DELETE") {
    try {
      const fileData = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(fileData);
      const filteredData = data.filter(
        (obj: any) => obj.id !== req.query.treeId
      );

      fs.writeFileSync(filePath, JSON.stringify(filteredData));

      res.status(200).json({ message: "Veri başarıyla silindi" });
    } catch (error) {
      res.status(500).json({ message: "Veri silinirken bir hata oluştu" });
    }
  } else {
    res.status(400).json({ error: "geçersiz istek" });
  }
};
export default saveDataApiRoute;
