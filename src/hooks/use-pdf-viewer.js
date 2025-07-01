import { useCallback } from 'react';

export function usePdfViewer() {
  const openPdfViewer = useCallback((blob) => {
    const pdfUrl = URL.createObjectURL(blob);

    const newWindow = window.open('', '_blank');
    if (!newWindow) return;

    const doc = newWindow.document;

    // Clean head & body
    doc.head.innerHTML = '';
    doc.body.innerHTML = '';

    // Add style
    const style = doc.createElement('style');
    style.textContent = `
        body { margin: 0; padding: 0; display: flex; flex-direction: column; height: 100vh; }
        iframe { flex: 1; border: none; width: 100%; }
        button {
          padding: 6px 12px;
          cursor: pointer;
          font-size: 14px;
        }
      `;
    doc.head.appendChild(style);

    // Create toolbar & buttons

    const iframe = doc.createElement('iframe');
    iframe.src = pdfUrl;
    doc.body.appendChild(iframe);
  }, []);

  return openPdfViewer;
}
