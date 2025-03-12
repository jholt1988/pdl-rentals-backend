import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// In ES modules, __dirname is not defined. Create an equivalent:
import { fileURLToPath } from 'url';

/**
 * Generates a payment statement PDF.
 * @param {Object} data - The data for the payment statement.
 * @param {string} data.tenantName - The name of the tenant.
 * @param {number} data.amount - The amount of the payment.
 * @param {string} data.date - The date of the payment.
 * @param {string} outputPath - The path where the PDF will be saved.
 */
export function generatePaymentStatement(data, outputPath) {
  const doc = new PDFDocument({ compress: true });
  
  // Pipe the PDF into a writable stream.
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);
  
  // Document Header
  doc.fontSize(18).text('Payment Statement', { align: 'center' });
  doc.moveDown();
  
  // Tenant Info
  doc.fontSize(12).text(`Tenant: ${data.tenant.name}`);
  doc.text(`Date: ${Date.now()}`);
  doc.moveDown();

  for(const entry of data.entries) {
    const d = new Date(entry.date);
    doc.text(`Date: ${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`);
    doc.text(`Amount: ${formatCurrency(entry.amount)}`);
    doc.text(`Description: ${entry.description}`);
    doc.moveDown();
  }
  doc.end();
  return outputPath;
  };


/**

 * @param {number} amount - The amount to format.
 * @param {string} [locale=en-US] - The locale to use for formatting.
 * @param {string} [currency=USD] - The currency to use for formatting.
 * @returns {string} The formatted currency string.
 */
function formatCurrency(amount, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
  // Add more details as needed...
  
  


