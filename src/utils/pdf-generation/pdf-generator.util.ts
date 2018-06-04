import { Response } from "express";
const PdfPrinter = require('pdfmake/src/printer');

/**
 * A utility class for generation of PDF files
 */
export class PdfGenerator {

    /**
     * Return the font configuration. The base path is the root folder of the project
     */
    private static getFonts() {
        return {
            Roboto: {
                normal: './assets/fonts/Roboto-Regular.ttf',
                bold: './assets/fonts/Roboto-Medium.ttf',
                italics: './assets/fonts/Roboto-Italic.ttf',
                bolditalics: './assets/fonts/Roboto-Italic.ttf'
            }
        };
    }

    /**
     * Generate the PDF file for the given template object, and send it back to the express request.
     * 
     * To decode the response use the following example
     * ```
     * httpClient.get('//your-url').toPromise().then(response => {
     *      const file = new Blob([response], { type: 'application/pdf' });
     *      const fileURL = URL.createObjectURL(file);
     *      return fileURL;
     *  });
     * ```
     *
     * @static
     * @param {*} documentTemplate The document template
     * @param {Response} response The express response stream where to send back the PDF once generated
     */
    public static generateAndSend(documentTemplate: any, response: Response) {

        const printer = new PdfPrinter(PdfGenerator.getFonts());

        const doc = printer.createPdfKitDocument(documentTemplate);

        doc.pipe(response);
        doc.end();
    }
}