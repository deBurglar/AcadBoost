
import { Button } from "../components/ui/button"; // shadcn/ui button
import { Download } from "lucide-react";

const ExportButtons = () => {
  const handleExport = (type: "excel" | "pdf") => {
    window.open(`http://localhost:3000/admin/export/${type}`, "_blank");
  };

  return (
    <div className="flex gap-3 mb-6">
      <Button
        onClick={() => handleExport("excel")}
        className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
      >
        <Download className="w-4 h-4 mr-2" /> Excel
      </Button>
      <Button
        onClick={() => handleExport("pdf")}
        className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
      >
        <Download className="w-4 h-4 mr-2" /> PDF
      </Button>
    </div>
  );
};

export default ExportButtons;