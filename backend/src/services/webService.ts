import axios from 'axios';
import * as cheerio from 'cheerio';
import type { SourceMetadata } from '../models/Source';

export interface WebExtractionResult {
  title: string;
  content: string;
  metadata: SourceMetadata;
}

export class WebService {
  static async extractFromURL(url: string): Promise<WebExtractionResult> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 30000,
      });

      const $ = cheerio.load(response.data);

      // Remove scripts, styles, and other non-content elements
      $('script, style, nav, header, footer, iframe, noscript').remove();

      // Extract title
      let title =
        $('meta[property="og:title"]').attr('content') ||
        $('meta[name="twitter:title"]').attr('content') ||
        $('title').text() ||
        'Página Web';

      // Extract main content
      let content = '';

      // Try to find main content area
      const mainSelectors = [
        'article',
        'main',
        '[role="main"]',
        '.content',
        '.main-content',
        '#content',
        '.article-content',
        '.post-content',
      ];

      let mainContent = null;
      for (const selector of mainSelectors) {
        const element = $(selector);
        if (element.length > 0) {
          mainContent = element;
          break;
        }
      }

      if (mainContent) {
        content = mainContent.text();
      } else {
        // Fallback: get all paragraph text
        $('p').each((_, elem) => {
          const text = $(elem).text().trim();
          if (text.length > 0) {
            content += text + '\n\n';
          }
        });
      }

      // Clean up content
      content = content
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n\n')
        .trim();

      // Extract metadata
      const metadata: SourceMetadata = {
        authors: this.extractAuthors($),
        abstract: $('meta[name="description"]').attr('content') ||
                 $('meta[property="og:description"]').attr('content'),
        keywords: this.extractKeywords($),
      };

      return {
        title: title.trim(),
        content,
        metadata,
      };
    } catch (error: any) {
      if (error.code === 'ENOTFOUND') {
        throw new Error('URL não encontrada');
      } else if (error.code === 'ETIMEDOUT') {
        throw new Error('Timeout ao acessar URL');
      }
      throw new Error(`Erro ao extrair conteúdo da web: ${error.message}`);
    }
  }

  private static extractAuthors($: cheerio.CheerioAPI): string[] {
    const authors: string[] = [];

    // Try various author meta tags
    $('meta[name="author"]').each((_, elem) => {
      const author = $(elem).attr('content');
      if (author) authors.push(author);
    });

    $('meta[property="article:author"]').each((_, elem) => {
      const author = $(elem).attr('content');
      if (author) authors.push(author);
    });

    // Try author elements
    $('.author, .author-name, [itemprop="author"]').each((_, elem) => {
      const author = $(elem).text().trim();
      if (author && !authors.includes(author)) {
        authors.push(author);
      }
    });

    return authors;
  }

  private static extractKeywords($: cheerio.CheerioAPI): string[] {
    const keywordsAttr = $('meta[name="keywords"]').attr('content');
    if (keywordsAttr) {
      return keywordsAttr.split(',').map(k => k.trim()).filter(k => k.length > 0);
    }
    return [];
  }
}
