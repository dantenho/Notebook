import { useState, useEffect } from 'react';
import {
  FileText,
  Globe,
  BookOpen,
  GraduationCap,
  Upload,
  Search,
  Plus,
  X,
  Loader2,
  Trash2,
  Eye,
} from 'lucide-react';
import { sourcesApi } from '../services/api';
import type {
  Source,
  SourceMetadata,
  PubMedSearchResult,
  SciELOSearchResult,
} from '../types';

interface SourceManagerProps {
  noteId: number;
  onSourcesUpdate?: () => void;
}

type SourceTab = 'list' | 'pdf' | 'web' | 'pubmed' | 'scielo';

export default function SourceManager({ noteId, onSourcesUpdate }: SourceManagerProps) {
  const [activeTab, setActiveTab] = useState<SourceTab>('list');
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // PDF upload
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Web extraction
  const [webUrl, setWebUrl] = useState('');

  // PubMed
  const [pubmedQuery, setPubmedQuery] = useState('');
  const [pubmedResults, setPubmedResults] = useState<PubMedSearchResult[]>([]);
  const [searchingPubMed, setSearchingPubMed] = useState(false);

  // SciELO
  const [scieloQuery, setScieloQuery] = useState('');
  const [scieloResults, setScieloResults] = useState<SciELOSearchResult[]>([]);
  const [searchingSciELO, setSearchingSciELO] = useState(false);

  // Selected source for viewing
  const [viewingSource, setViewingSource] = useState<Source | null>(null);

  useEffect(() => {
    loadSources();
  }, [noteId]);

  const loadSources = async () => {
    try {
      const response = await sourcesApi.getByNoteId(noteId);
      setSources(response.data);
    } catch (err: any) {
      console.error('Error loading sources:', err);
    }
  };

  const handleUploadPDF = async () => {
    if (!pdfFile) return;

    setLoading(true);
    setError('');

    try {
      await sourcesApi.uploadPDF(noteId, pdfFile);
      setPdfFile(null);
      setActiveTab('list');
      await loadSources();
      onSourcesUpdate?.();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer upload do PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleExtractWeb = async () => {
    if (!webUrl.trim()) return;

    setLoading(true);
    setError('');

    try {
      await sourcesApi.extractWeb(noteId, webUrl);
      setWebUrl('');
      setActiveTab('list');
      await loadSources();
      onSourcesUpdate?.();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao extrair conteúdo da web');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPubMed = async () => {
    if (!pubmedQuery.trim()) return;

    setSearchingPubMed(true);
    setError('');

    try {
      const response = await sourcesApi.searchPubMed(pubmedQuery, 20);
      setPubmedResults(response.data);
    } catch (err: any) {
      setError('Erro ao buscar no PubMed');
    } finally {
      setSearchingPubMed(false);
    }
  };

  const handleAddPubMed = async (pmid: string) => {
    setLoading(true);
    setError('');

    try {
      await sourcesApi.fetchPubMed(noteId, pmid);
      setPubmedResults([]);
      setPubmedQuery('');
      setActiveTab('list');
      await loadSources();
      onSourcesUpdate?.();
    } catch (err: any) {
      setError('Erro ao adicionar artigo do PubMed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSciELO = async () => {
    if (!scieloQuery.trim()) return;

    setSearchingSciELO(true);
    setError('');

    try {
      const response = await sourcesApi.searchSciELO(scieloQuery, 20);
      setScieloResults(response.data);
    } catch (err: any) {
      setError('Erro ao buscar no SciELO');
    } finally {
      setSearchingSciELO(false);
    }
  };

  const handleAddSciELO = async (url: string) => {
    setLoading(true);
    setError('');

    try {
      await sourcesApi.fetchSciELO(noteId, url);
      setScieloResults([]);
      setScieloQuery('');
      setActiveTab('list');
      await loadSources();
      onSourcesUpdate?.();
    } catch (err: any) {
      setError('Erro ao adicionar artigo do SciELO');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSource = async (id: number) => {
    if (!confirm('Tem certeza que deseja remover esta fonte?')) return;

    try {
      await sourcesApi.delete(id);
      await loadSources();
      setViewingSource(null);
      onSourcesUpdate?.();
    } catch (err: any) {
      setError('Erro ao deletar fonte');
    }
  };

  const getMetadata = (source: Source): SourceMetadata | null => {
    if (!source.metadata) return null;
    try {
      return JSON.parse(source.metadata);
    } catch {
      return null;
    }
  };

  const getSourceIcon = (type: Source['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText size={16} className="text-red-600" />;
      case 'web':
        return <Globe size={16} className="text-blue-600" />;
      case 'pubmed':
        return <GraduationCap size={16} className="text-green-600" />;
      case 'scielo':
        return <BookOpen size={16} className="text-purple-600" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="border-b border-gray-200">
        <div className="flex items-center gap-2 p-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-2 rounded flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'list'
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'hover:bg-gray-100'
            }`}
          >
            <FileText size={16} />
            Fontes ({sources.length})
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-3 py-2 rounded flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pdf'
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'hover:bg-gray-100'
            }`}
          >
            <Upload size={16} />
            PDF
          </button>
          <button
            onClick={() => setActiveTab('web')}
            className={`px-3 py-2 rounded flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'web'
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'hover:bg-gray-100'
            }`}
          >
            <Globe size={16} />
            Web
          </button>
          <button
            onClick={() => setActiveTab('pubmed')}
            className={`px-3 py-2 rounded flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pubmed'
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'hover:bg-gray-100'
            }`}
          >
            <GraduationCap size={16} />
            PubMed
          </button>
          <button
            onClick={() => setActiveTab('scielo')}
            className={`px-3 py-2 rounded flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'scielo'
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'hover:bg-gray-100'
            }`}
          >
            <BookOpen size={16} />
            SciELO
          </button>
        </div>
      </div>

      <div className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* List Tab */}
        {activeTab === 'list' && (
          <div className="space-y-2">
            {sources.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                <p>Nenhuma fonte adicionada ainda</p>
                <p className="text-sm mt-1">
                  Use as abas acima para adicionar PDFs, páginas web ou artigos científicos
                </p>
              </div>
            ) : (
              sources.map((source) => {
                const metadata = getMetadata(source);
                return (
                  <div
                    key={source.id}
                    className="border border-gray-200 rounded p-3 hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getSourceIcon(source.type)}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{source.title}</h4>
                        {metadata && (
                          <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                            {metadata.authors && metadata.authors.length > 0 && (
                              <p>
                                <strong>Autores:</strong> {metadata.authors.slice(0, 3).join(', ')}
                                {metadata.authors.length > 3 && ' et al.'}
                              </p>
                            )}
                            {metadata.journal && (
                              <p>
                                <strong>Journal:</strong> {metadata.journal}
                              </p>
                            )}
                            {metadata.year && (
                              <p>
                                <strong>Ano:</strong> {metadata.year}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setViewingSource(source)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Ver conteúdo"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteSource(source.id!)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded"
                          title="Remover"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* PDF Tab */}
        {activeTab === 'pdf' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Faça upload de artigos, livros ou documentos em PDF
            </p>
            <div>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {pdfFile && (
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium">{pdfFile.name}</p>
                <p className="text-xs text-gray-600">
                  {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
            <button
              onClick={handleUploadPDF}
              disabled={!pdfFile || loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Adicionar PDF
                </>
              )}
            </button>
          </div>
        )}

        {/* Web Tab */}
        {activeTab === 'web' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Extraia conteúdo de páginas web, artigos online ou blogs
            </p>
            <input
              type="url"
              value={webUrl}
              onChange={(e) => setWebUrl(e.target.value)}
              placeholder="https://exemplo.com/artigo"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleExtractWeb}
              disabled={!webUrl.trim() || loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Extraindo...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Extrair Conteúdo
                </>
              )}
            </button>
          </div>
        )}

        {/* PubMed Tab */}
        {activeTab === 'pubmed' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Busque artigos científicos no PubMed (foco em medicina)
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={pubmedQuery}
                onChange={(e) => setPubmedQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchPubMed()}
                placeholder="Ex: diabetes mellitus type 2"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearchPubMed}
                disabled={!pubmedQuery.trim() || searchingPubMed}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {searchingPubMed ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
              </button>
            </div>

            {pubmedResults.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {pubmedResults.map((result) => (
                  <div key={result.pmid} className="border border-gray-200 rounded p-3">
                    <h4 className="font-medium text-sm mb-2">{result.title}</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>
                        <strong>Autores:</strong> {result.authors.slice(0, 3).join(', ')}
                        {result.authors.length > 3 && ' et al.'}
                      </p>
                      <p>
                        <strong>Journal:</strong> {result.journal}
                      </p>
                      <p>
                        <strong>Ano:</strong> {result.year}
                      </p>
                      <p className="text-gray-500">PMID: {result.pmid}</p>
                    </div>
                    <button
                      onClick={() => handleAddPubMed(result.pmid)}
                      disabled={loading}
                      className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                    >
                      {loading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Plus size={14} />
                      )}
                      Adicionar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SciELO Tab */}
        {activeTab === 'scielo' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Busque artigos científicos no SciELO (português/espanhol)
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={scieloQuery}
                onChange={(e) => setScieloQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSciELO()}
                placeholder="Ex: diabetes mellitus tipo 2"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearchSciELO}
                disabled={!scieloQuery.trim() || searchingSciELO}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {searchingSciELO ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
              </button>
            </div>

            {scieloResults.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {scieloResults.map((result) => (
                  <div key={result.id} className="border border-gray-200 rounded p-3">
                    <h4 className="font-medium text-sm mb-2">{result.title}</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>
                        <strong>Autores:</strong> {result.authors.slice(0, 3).join(', ')}
                        {result.authors.length > 3 && ' et al.'}
                      </p>
                      <p>
                        <strong>Journal:</strong> {result.journal}
                      </p>
                      <p>
                        <strong>Ano:</strong> {result.year}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddSciELO(result.url)}
                      disabled={loading}
                      className="mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1"
                    >
                      {loading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Plus size={14} />
                      )}
                      Adicionar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Source Viewer Modal */}
      {viewingSource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-lg">{viewingSource.title}</h3>
              <button
                onClick={() => setViewingSource(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {viewingSource.content}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
