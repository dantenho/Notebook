import axios from 'axios';
import * as cheerio from 'cheerio';
import type { SourceMetadata } from '../models/Source';

export interface SciELOSearchResult {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  url: string;
}

export interface SciELOArticle {
  title: string;
  content: string;
  metadata: SourceMetadata;
}

export class SciELOService {
  private static readonly SEARCH_API = 'https://search.scielo.org/';
  private static readonly ARTICLE_BASE = 'https://www.scielo.br/j/';

  /**
   * Buscar artigos no SciELO
   */
  static async search(query: string, maxResults: number = 20): Promise<SciELOSearchResult[]> {
    try {
      const response = await axios.get(this.SEARCH_API, {
        params: {
          q: query,
          lang: 'pt',
          count: maxResults,
          from: 0,
          output: 'site',
          sort: '',
          format: 'summary',
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const results: SciELOSearchResult[] = [];

      $('.results .item').each((_, element) => {
        const $item = $(element);

        const title = $item.find('.title').text().trim();
        const authorsText = $item.find('.authors').text().trim();
        const authors = authorsText
          .split(';')
          .map(a => a.trim())
          .filter(a => a.length > 0);

        const sourceText = $item.find('.source').text();
        const journal = sourceText.split('|')[0]?.trim() || '';
        const yearMatch = sourceText.match(/\b(19|20)\d{2}\b/);
        const year = yearMatch ? parseInt(yearMatch[0]) : 0;

        const linkElement = $item.find('a.title');
        const url = linkElement.attr('href') || '';

        // Extract ID from URL
        const idMatch = url.match(/pid=([^&]+)/);
        const id = idMatch ? idMatch[1] : '';

        if (title && id) {
          results.push({
            id,
            title,
            authors,
            journal,
            year,
            url,
          });
        }
      });

      return results;
    } catch (error: any) {
      throw new Error(`Erro ao buscar no SciELO: ${error.message}`);
    }
  }

  /**
   * Obter artigo completo do SciELO por URL
   */
  static async fetchArticle(url: string): Promise<SciELOArticle> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);

      // Extract title
      const title =
        $('h1.article-title').text().trim() ||
        $('meta[name="citation_title"]').attr('content') ||
        'Sem título';

      // Extract authors
      const authors: string[] = [];
      $('.contrib-group .contrib').each((_, elem) => {
        const name = $(elem).find('.name, .given-names, .surname').text().trim();
        if (name) authors.push(name);
      });

      // If no authors found, try meta tags
      if (authors.length === 0) {
        $('meta[name="citation_author"]').each((_, elem) => {
          const author = $(elem).attr('content');
          if (author) authors.push(author);
        });
      }

      // Extract abstract
      let abstract = '';
      $('.abstract').each((_, elem) => {
        const $abstract = $(elem);
        // Remove the "RESUMO" or "ABSTRACT" heading
        $abstract.find('h1, .title').remove();
        abstract += $abstract.text().trim() + '\n\n';
      });

      // Extract full text if available
      let fullText = '';
      $('.article-body, .content').each((_, elem) => {
        fullText += $(elem).text().trim() + '\n\n';
      });

      // Extract metadata
      const journal =
        $('.journal-title').text().trim() ||
        $('meta[name="citation_journal_title"]').attr('content') ||
        '';

      const yearText =
        $('.pub-date').text() ||
        $('meta[name="citation_publication_date"]').attr('content') ||
        '';
      const yearMatch = yearText.match(/\b(19|20)\d{2}\b/);
      const year = yearMatch ? parseInt(yearMatch[0]) : 0;

      const doi = $('meta[name="citation_doi"]').attr('content') || '';

      const keywords: string[] = [];
      $('.kwd-group .kwd').each((_, elem) => {
        const keyword = $(elem).text().trim();
        if (keyword) keywords.push(keyword);
      });

      // Build content
      const content = `
${title}

Autores: ${authors.join(', ')}
Journal: ${journal}
Ano: ${year}
${doi ? `DOI: ${doi}` : ''}

RESUMO
${abstract}

${fullText ? `TEXTO COMPLETO\n${fullText}` : ''}
      `.trim();

      const metadata: SourceMetadata = {
        authors,
        journal,
        year,
        doi,
        abstract: abstract.trim(),
        keywords,
      };

      return {
        title,
        content,
        metadata,
      };
    } catch (error: any) {
      throw new Error(`Erro ao buscar artigo do SciELO: ${error.message}`);
    }
  }
}
