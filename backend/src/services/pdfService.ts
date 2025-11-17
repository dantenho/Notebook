import pdf from 'pdf-parse';
import fs from 'fs/promises';
import type { SourceMetadata } from '../models/Source';

export interface PDFExtractionResult {
  title: string;
  content: string;
  metadata: SourceMetadata;
}

export class PDFService {
  static async extractFromFile(filePath: string): Promise<PDFExtractionResult> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);

      // Extract metadata
      const metadata: SourceMetadata = {
        pageCount: data.numpages,
        ...(data.info || {}),
      };

      // Try to extract title from metadata or first lines
      let title = metadata.Title || 'Documento PDF';
      if (!metadata.Title && data.text) {
        const lines = data.text.split('\n').filter(line => line.trim().length > 0);
        if (lines.length > 0) {
          title = lines[0].substring(0, 100);
        }
      }

      return {
        title,
        content: data.text,
        metadata,
      };
    } catch (error: any) {
      throw new Error(`Erro ao processar PDF: ${error.message}`);
    }
  }

  static async extractFromBuffer(buffer: Buffer, filename: string): Promise<PDFExtractionResult> {
    try {
      const data = await pdf(buffer);

      const metadata: SourceMetadata = {
        pageCount: data.numpages,
        ...(data.info || {}),
      };

      let title = metadata.Title || filename.replace('.pdf', '');
      if (!metadata.Title && data.text) {
        const lines = data.text.split('\n').filter(line => line.trim().length > 0);
        if (lines.length > 0) {
          title = lines[0].substring(0, 100);
        }
      }

      return {
        title,
        content: data.text,
        metadata,
      };
    } catch (error: any) {
      throw new Error(`Erro ao processar PDF: ${error.message}`);
    }
  }
}
