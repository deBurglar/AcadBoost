import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function StaticQr() {
  const [qrData, setQrData] = useState("");
    const data = "Judge"; 
    setQrData(data);


  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-xl font-bold mb-4">Static QR Code</h2>
      {qrData && <QRCodeCanvas value={qrData} size={200} />}
    </div>
  );
}