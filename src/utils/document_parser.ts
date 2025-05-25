import fs from 'fs';
import { promisify } from 'util';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const readFileAsync = promisify(fs.readFile);

class DocumentParser {
    static async parseDocument(
        file: Express.Multer.File
    ): Promise<{ content: string; parsed_at: Date }> {
        try {
            let content = '';
            const fileBuffer = await readFileAsync(file.path);

            if (file.mimetype === 'application/pdf') {
                const pdfData = await pdfParse(fileBuffer);
                content = pdfData.text;
            } else if (
                file.mimetype === 'application/msword' ||
                file.mimetype ===
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
                const result = await mammoth.extractRawText({
                    buffer: fileBuffer
                });
                content = result.value;
            }

            return {
                content,
                parsed_at: new Date()
            };
        } catch (error) {
            console.error('Error parsing document:', error);
            return {
                content: '',
                parsed_at: new Date()
            };
        }
    }
}

export default DocumentParser;
