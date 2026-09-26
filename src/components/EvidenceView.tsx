import React, { useState, useEffect } from 'react';
import { 
  BookOpenCheck, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Bookmark, 
  ShieldCheck, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { EvidenceDocument } from '../types/clinical';

export const EvidenceView: React.FC = () => {
  const [evidenceList, setEvidenceList] = useState<EvidenceDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeDoc, setActiveDoc] = useState<EvidenceDocument | null>(null);
  const [isSearchingRag, setIsSearchingRag] = useState(false);
  const [ragSearchResult, setRagSearchResult] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/evidence')
      .then(res => res.json())
      .then(data => {
        setEvidenceList(data);
        if (data.length > 0) setActiveDoc(data[0]);
      })
      .catch(err => console.error('Failed to load evidence library:', err));
  }, []);

  const categories = ['ALL', ...Array.from(new Set(evidenceList.map(e => e.category)))];

  const filteredEvidence = evidenceList.filter(doc => {
    const matchesCat = selectedCategory === 'ALL' || doc.category === selectedCategory;
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleTestRagQuery = async (query: string) => {
    setIsSearchingRag(true);
    setRagSearchResult(null);
    try {
      const res = await fetch('/api/rag/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit: 3 })
      });
      const data = await res.json();
      if (data.status === 'INSUFFICIENT_EVIDENCE') {
        setRagSearchResult('Insufficient evidence retrieved.');
      } else {
        const top = data.results[0];
        if (top) {
          setActiveDoc(top);
          setRagSearchResult(`Top Grounded Match (${top.relevance_percentage}%): ${top.title}`);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchingRag(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold mb-1">
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>Trusted Reference Knowledge Base</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clinical Evidence Library</h1>
          <p className="text-xs text-slate-700">Curated, accredited medical practice guidelines used by the RAG retrieval pipeline</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Zero Fabricated Citations Policy</span>
        </div>
      </div>

      {/* RAG Query Test Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            Semantic RAG Search Tester
          </span>
          {ragSearchResult && (
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              {ragSearchResult}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-700 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Test clinical retrieval query (e.g. 'elevated troponin exertional chest tightness', 'NSAID in CKD', 'Beers criteria fall risk')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
          <button
            onClick={() => handleTestRagQuery(searchQuery || 'HFrEF SGLT2 inhibitor GDMT')}
            disabled={isSearchingRag}
            className="w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shrink-0 cursor-pointer shadow-xs transition-colors"
          >
            {isSearchingRag ? 'Retrieving...' : 'Run Vector RAG Match'}
          </button>
        </div>

        {/* Quick query chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-700">
          <span>Quick queries:</span>
          {['HFrEF guideline therapy', 'Chest discomfort troponin', 'Uncontrolled diabetes HbA1c > 10', 'COPD exacerbation oxygen target', 'Acute kidney injury NSAID'].map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(q);
                handleTestRagQuery(q);
              }}
              className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Documents List, Right Active Document Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left List (5/12) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredEvidence.map((doc) => {
            const isActive = activeDoc?.id === doc.id;
            return (
              <div
                key={doc.id}
                onClick={() => setActiveDoc(doc)}
                className={`bg-white rounded-2xl border p-4 shadow-xs transition-all cursor-pointer space-y-2 hover:border-teal-400 ${
                  isActive ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded uppercase">
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-700">{doc.publication_year}</span>
                </div>

                <h3 className="font-bold text-xs text-slate-900 leading-snug">
                  {doc.title}
                </h3>

                <div className="text-[11px] text-slate-700 font-medium line-clamp-1">
                  Section: {doc.section}
                </div>

                <p className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed">
                  {doc.content}
                </p>

                <div className="text-[10px] text-slate-700 font-mono truncate pt-1 border-t border-slate-100">
                  {doc.source}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Reader (7/12) */}
        <div className="lg:col-span-7">
          {activeDoc ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 sticky top-20">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg uppercase">
                    {activeDoc.category}
                  </span>
                  <span className="text-xs font-mono text-slate-700">{activeDoc.id}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">{activeDoc.title}</h2>
                <p className="text-xs text-slate-700 mt-1">{activeDoc.source} • Published {activeDoc.publication_year}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  Guideline Section Focus
                </span>
                <p className="text-xs font-semibold text-slate-900">{activeDoc.section}</p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                  Authoritative Guidance Text
                </span>
                <p className="text-xs text-slate-800 leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-100">
                  {activeDoc.content}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                  Foundational Clinical Recommendations
                </span>
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {activeDoc.key_recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2 bg-teal-50/50 rounded-lg border border-teal-100">
                      <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-700 flex items-center justify-between">
                <span>Journal Citation: <strong>{activeDoc.url_reference}</strong></span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-700 bg-white rounded-2xl border border-slate-200">
              Select a guideline from the left panel.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
