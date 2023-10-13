import { jsPDF } from 'jspdf';

import html2Canvas from 'html2canvas';

export const generatePdf = async (id: string, name?: string) => {
  const data = document.getElementById(id);

  //  const text = document.getElementById('artist');
  // const text = document.getElementById('title');

  // start creating the PDF

  const pdf = new jsPDF('p', 'mm', 'a4');
  const numberOfCards = data!.childNodes?.length;
  let cardOnPage = 1;

  for (let i = 0; i < numberOfCards - 1; i++) {
    const card = data?.childNodes[i];
    if (i % 3 === 0) {
      pdf.addPage();
      pdf.setPage(i / 3 + 2);
      cardOnPage = 1;
    } else {
      cardOnPage++;
    }
    await html2Canvas(card as any).then((srcImgCard) => {
      const canvasDataURL = srcImgCard.toDataURL('image/png', 1.0);
      const width = window.innerWidth;
      const height = window.innerHeight;
      const x = 20;
      const y = 14 + (cardOnPage - 1) * 80;
      // pdf.text(text!.innerHTML, 10, 10);
      pdf.addImage(canvasDataURL, 'PNG', x, y, width * 0.13, height * 0.09);
    });
  }

  const pdfName = name ? name + '.pdf' : 'myPdf.pdf';
  pdf.deletePage(1);
  pdf.save(pdfName);
};
