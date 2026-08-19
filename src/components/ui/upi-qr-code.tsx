import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { cn } from "@/lib/utils";

interface UpiQrCodeProps {
  upiId: string;
  amount: number;
  payeeName?: string;
  note?: string;
  className?: string;
}

export function UpiQrCode({
  upiId,
  amount,
  payeeName = "Gods Creatures",
  note = "Grooming booking fee",
  className,
}: UpiQrCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&am=${amount}&pn=${encodeURIComponent(payeeName)}&cu=INR&tn=${encodeURIComponent(note)}`;
    QRCode.toDataURL(upiLink, { width: 200, margin: 2, color: { dark: "#000000", light: "#ffffff" } })
      .then((url) => {
        setQrDataUrl(url);
        setError(false);
      })
      .catch(() => setError(true));
  }, [upiId, amount, payeeName, note]);

  if (error) {
    return (
      <p className="text-white/60 text-xs text-center">
        QR unavailable — pay manually to {upiId}
      </p>
    );
  }

  if (!qrDataUrl) {
    return <div className="w-[200px] h-[200px] bg-white/10 rounded-lg animate-pulse" aria-label="Generating QR code" />;
  }

  return (
    <img
      src={qrDataUrl}
      alt="Scan to pay via UPI"
      width={200}
      height={200}
      className={cn("rounded-lg bg-white p-2", className)}
    />
  );
}
