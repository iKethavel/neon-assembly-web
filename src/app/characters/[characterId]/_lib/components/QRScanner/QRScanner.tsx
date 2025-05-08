// QRScanner.tsx
"use client"; // Add this if using Next.js App Router

import { useEffect, useCallback } from 'react';
import type { QrcodeErrorCallback, QrcodeSuccessCallback } from 'html5-qrcode';
import { Html5QrcodeScanner } from 'html5-qrcode';

export const QRScanner: React.FC = () => {
  const onScanSuccess = useCallback<QrcodeSuccessCallback>((decodedText, decodedResult) => {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
  }, [])

  const onScanFailure = useCallback<QrcodeErrorCallback>((error) => {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  }, [])


  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    )

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);

    return () => {
      html5QrcodeScanner.pause()
      void html5QrcodeScanner.clear()
    }
  }, [onScanFailure, onScanSuccess])

  return (
    <div id="reader" className="w-full" ></div>
  );
};
