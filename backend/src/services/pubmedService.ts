import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import type { SourceMetadata } from '../models/Source';

export interface PubMedSearchResult {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract?: string;
}

export interface PubMedArticle {
  title: string;
  content: string;
  metadata: SourceMetadata;
}

export class PubMedService {
  private static readonly BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

  /**
   * Buscar artigos no PubMed
   */
  static async search(query: string, maxResults: number = 20): Promise<PubMedSearchResult[]> {
    try {
      // Step 1: Search and get PMIDs
      const searchUrl = `${this.BASE_URL}/esearch.fcgi`;
      const searchResponse = await axios.get(searchUrl, {
        params: {
          db: 'pubmed',
          term: query,
          retmax: maxResults,
          retmode: 'json',
        },
      });

      const pmids = searchResponse.data.esearchresult?.idlist || [];

      if (pmids.length === 0) {
        return [];
      }

      // Step 2: Fetch details for all PMIDs
      const summaryUrl = `${this.BASE_URL}/esummary.fcgi`;
      const summaryResponse = await axios.get(summaryUrl, {
        params: {
          db: 'pubmed',
          id: pmids.join(','),
          retmode: 'json',
        },
      });

      const results: PubMedSearchResult[] = [];
      const articles = summaryResponse.data.result;

      for (const pmid of pmids) {
        const article = articles[pmid];
        if (!article) continue;

        results.push({
          pmid,
          title: article.title || 'Sem título',
          authors: article.authors?.map((a: any) => a.name) || [],
          journal: article.fulljournalname || article.source || '',
          year: parseInt(article.pubdate?.substring(0, 4)) || 0,
        });
      }

      return results;
    } catch (error: any) {
      throw new Error(`Erro ao buscar no PubMed: ${error.message}`);
    }
  }

  /**
   * Obter artigo completo do PubMed por PMID
   */
  static async fetchArticle(pmid: string): Promise<PubMedArticle> {
    try {
      // Fetch article in XML format
      const fetchUrl = `${this.BASE_URL}/efetch.fcgi`;
      const response = await axios.get(fetchUrl, {
        params: {
          db: 'pubmed',
          id: pmid,
          retmode: 'xml',
        },
      });

      const parsed = await parseStringPromise(response.data);
      const article = parsed.PubmedArticleSet?.PubmedArticle?.[0];

      if (!article) {
        throw new Error('Artigo não encontrado');
      }

      const medlineCitation = article.MedlineCitation?.[0];
      const articleData = medlineCitation?.Article?.[0];

      // Extract title
      const title = articleData?.ArticleTitle?.[0] || 'Sem título';

      // Extract authors
      const authors: string[] = [];
      const authorList = articleData?.AuthorList?.[0]?.Author || [];
      for (const author of authorList) {
        const lastName = author.LastName?.[0] || '';
        const foreName = author.ForeName?.[0] || '';
        if (lastName || foreName) {
          authors.push(`${foreName} ${lastName}`.trim());
        }
      }

      // Extract abstract
      const abstractParts = articleData?.Abstract?.[0]?.AbstractText || [];
      let abstract = '';
      for (const part of abstractParts) {
        if (typeof part === 'string') {
          abstract += part + '\n\n';
        } else if (part._) {
          const label = part.$.Label || '';
          abstract += (label ? `${label}: ` : '') + part._ + '\n\n';
        }
      }

      // Extract journal info
      const journal = articleData?.Journal?.[0];
      const journalTitle = journal?.Title?.[0] || '';
      const pubDate = journal?.JournalIssue?.[0]?.PubDate?.[0];
      const year = parseInt(pubDate?.Year?.[0]) || 0;

      // Extract keywords
      const keywords: string[] = [];
      const keywordList = medlineCitation?.KeywordList?.[0]?.Keyword || [];
      for (const keyword of keywordList) {
        if (typeof keyword === 'string') {
          keywords.push(keyword);
        } else if (keyword._) {
          keywords.push(keyword._);
        }
      }

      // Extract DOI
      const articleIds = article.PubmedData?.[0]?.ArticleIdList?.[0]?.ArticleId || [];
      let doi = '';
      for (const id of articleIds) {
        if (id.$.IdType === 'doi') {
          doi = id._;
          break;
        }
      }

      // Build content
      const content = `
${title}

Autores: ${authors.join(', ')}
Journal: ${journalTitle}
Ano: ${year}
PMID: ${pmid}
${doi ? `DOI: ${doi}` : ''}

RESUMO
${abstract}
      `.trim();

      const metadata: SourceMetadata = {
        authors,
        journal: journalTitle,
        year,
        pmid,
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
      throw new Error(`Erro ao buscar artigo do PubMed: ${error.message}`);
    }
  }
}
