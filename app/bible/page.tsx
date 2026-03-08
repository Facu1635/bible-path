'use client';

import { useState, useEffect } from 'react';
import genesis from '@/public/data/genesis.json';

const BOOKS = [
  { id: 'GEN', name: 'Génesis', chapters: 50 },
  { id: 'EXO', name: 'Éxodo', chapters: 40 },
  { id: 'LEV', name: 'Levítico', chapters: 27 },
];

export default function Bible() {
  const [selectedBook, setSelectedBook] = useState('GEN');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChapter();
  }, [selectedBook, selectedChapter]);

  const loadChapter = async () => {
    setLoading(true);
    
    // Por ahora, solo Génesis está disponible localmente
    if (selectedBook === 'GEN') {
      const chapterKey = selectedChapter.toString() as keyof typeof genesis;
      const chapterData = genesis[chapterKey];
      if (chapterData) {
        setVerses(chapterData);
      } else {
        setVerses([]);
      }
    } else {
      // Fallback: usar API.Bible
      try {
        const response = await fetch(
          `https://api.scripture.api.bible/v1/bibles/592420522e16049f-01/chapters/${selectedBook}.${selectedChapter}?include-verses=true`,
          {
            headers: {
              'api-key': process.env.NEXT_PUBLIC_API_BIBLE_KEY || '',
            },
          }
        );
        const data = await response.json();
        setVerses(data.data?.verses || []);
      } catch (error) {
        setVerses([]);
      }
    }
    
    setLoading(false);
  };

  const currentBook = BOOKS.find(b => b.id === selectedBook);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 sticky top-0 z-10 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-bold text-lg">Biblia</h1>
          <span className="text-xs text-gray-500">RVR1960</span>
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedBook}
            onChange={(e) => { setSelectedBook(e.target.value); setSelectedChapter(1); }}
            className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
          >
            {BOOKS.map(book => (
              <option key={book.id} value={book.id}>{book.name}</option>
            ))}
          </select>
          
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(Number(e.target.value))}
            className="w-24 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
          >
            {Array.from({ length: currentBook?.chapters || 50 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Cap {i + 1}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-serif font-bold mb-6 text-center">
          {currentBook?.name} {selectedChapter}
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4 font-serif text-lg leading-relaxed">
            {verses.map((verse, i) => (
              <p key={i} className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors cursor-pointer">
                <sup className="text-purple-600 font-bold mr-2 text-sm">
                  {verse.verse || i + 1}
                </sup>
                {verse.text || verse.content}
              </p>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-8 border-t">
          <button
            onClick={() => setSelectedChapter(Math.max(1, selectedChapter - 1))}
            disabled={selectedChapter === 1}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50"
          >
            ← Anterior
          </button>
          <button
            onClick={() => setSelectedChapter(selectedChapter + 1)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}