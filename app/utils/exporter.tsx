import { dataProvider } from "../dataProvider";
import * as XLSX from "xlsx";

export default function CustomExporter(resource: string, sheetname: string) {
  dataProvider
    .getList(resource, {
      pagination: { page: 1, perPage: 10000 },
    })
    .then(({ data }) => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Moradores");

      XLSX.writeFile(workbook, `${sheetname}.xlsx`);
    })
    .catch((error) => {
      alert("Ocorreu um erro ao exportar os dados. Por favor tente novamente");
      console.error("Erro ao exportar dados:", error);
    });

  return;
}
