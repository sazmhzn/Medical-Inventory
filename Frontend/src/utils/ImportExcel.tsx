import { postInventoryItem } from "@/services/InventoryAPI";

export const importCsv = async (csvFile: File) => {
  try {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target.result) {
        const csvData = event.target.result as string;
        const rows = csvData.split("\n");
        const headers = rows.shift().split(",");
        const items = rows.map((row) => {
          const item = {};
          const values = row.split(",");
          headers.forEach((header, index) => {
            item[header] = values[index];
          });
          return item;
        });

        for (const item of items) {
          try {
            await postInventoryItem(item);
            console.log(`Item added: ${item}`);
          } catch (error) {
            console.error(`Error adding item: ${error.message}`);
          }
        }
      }
    };
    reader.readAsText(csvFile);
  } catch (error) {
    console.error(`Error importing CSV: ${error.message}`);
  }
};
