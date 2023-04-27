import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Veri kaydedilecek JSON dosyasının yolu
const filePath = path.join(process.cwd(), "tree.json");

// Veri kaydetme işlemini gerçekleştiren API rotası
const saveDataApiRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // Gönderilen veriyi al
    const { label, children, id } = req.body;

    // JSON dosyasına veriyi kaydet
    try {
      // JSON dosyasındaki mevcut veriyi oku
      const existingData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      // Yeni veriyi ekle
      let newData = {
        label,
        children: [],
        id: uuidv4(),
      };
      existingData.push(newData);
      // JSON dosyasına güncellenmiş veriyi kaydet
      fs.writeFileSync(filePath, JSON.stringify(existingData));

      console.log(existingData);
      console.log("Veri JSON dosyasına kaydedildi.");
      res.status(200).json({ message: "Veri başarıyla kaydedildi." });
    } catch (error) {
      console.error(
        "JSON dosyasına veri kaydedilirken bir hata oluştu:",
        error
      );
      res.status(500).json({ message: "Veri kaydedilirken bir hata oluştu." });
    }
  } else if (req.method === "GET") {
    try {
      // JSON dosyasından veriyi oku
      const fileData = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(fileData);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Veri okunurken bir hata oluştu." });
    }
  } else {
    res.status(400).json({ error: "geçersiz istek" });
  }
};
export default saveDataApiRoute;
