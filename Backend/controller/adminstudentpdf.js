const { fetchStudentCountPerYear, fetchStudentCountForAllDepartments } = require('./adminanalysisservice');
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const adminstudentpdf = async (req, res) => {
  try {
    const tmpDir = path.join(__dirname, "../tmp");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}
    const yearData = await fetchStudentCountPerYear(req, res, true);
    const deptData = await fetchStudentCountForAllDepartments(req, res, true);

   const filePath = path.join(tmpDir, "data.pdf");
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(18).text("Student Analytics Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text("📊 Students per Year");
    yearData.forEach((y) => doc.text(`Year ${y.year}: ${y.totalStudents}`));
    doc.moveDown();

    doc.fontSize(14).text("📊 Students per Department");
    deptData.forEach((d) => doc.text(`${d.department}: ${d.totalStudents}`));

    doc.end();

    doc.on("finish", () => {
      res.download(filePath, "student-data.pdf", (err) => {
        if (!err) fs.unlinkSync(filePath);
      });
    });
  } catch (err) {
    console.error("PDF export failed:", err);
    res.status(500).json({ error: "Failed to export PDF" });
  }
};

module.exports={adminstudentpdf}