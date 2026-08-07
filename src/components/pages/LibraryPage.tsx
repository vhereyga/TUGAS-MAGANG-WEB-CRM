import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LibraryItem } from '../../types';
import { 
  Folder, 
  BookOpen, 
  FileText, 
  Video, 
  Download, 
  Plus, 
  Search, 
  X, 
  Sparkles 
} from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const { libraryItems, addLibraryItem, currentRole, searchQuery } = useApp();

  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'E-book' | 'Jurnal' | 'Video'>('E-book');
  const [newAuthor, setNewAuthor] = useState('Tim SkillSet');
  const [newCategory, setNewCategory] = useState('Programming');

  const filteredItems = libraryItems.filter(item => {
    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addLibraryItem({
      title: newTitle,
      type: newType,
      author: newAuthor,
      category: newCategory,
      fileSize: '3.5 MB',
      downloadUrl: '#',
      coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=300&q=80'
    });

    setShowAddModal(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Library (Pusat Aset Digital)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pusat penyimpanan E-book, Jurnal Akademik, & Rekaman Video (Supabase Storage)
          </p>
        </div>

        {(currentRole === 'admin' || currentRole === 'teacher') && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-btn shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>+ Upload Aset Digital</span>
          </button>
        )}
      </div>

      {/* Type Filter Buttons */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        {['All', 'E-book', 'Jurnal', 'Video'].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-4 py-2 rounded-xl transition-all ${
              typeFilter === t
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {t === 'All' ? 'Semua Aset' : t}
          </button>
        ))}
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:shadow-md transition-all group"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1.5">
                {item.type === 'E-book' && <BookOpen className="w-3 h-3 text-emerald-400" />}
                {item.type === 'Jurnal' && <FileText className="w-3 h-3 text-blue-400" />}
                {item.type === 'Video' && <Video className="w-3 h-3 text-red-400" />}
                <span>{item.type}</span>
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                {item.category} • {item.fileSize}
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400">Penulis: {item.author}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Ditambahkan: {item.addedDate}</span>
              <button
                onClick={() => alert(`Mengunduh file ${item.title} (${item.fileSize}) dari Supabase Storage...`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Library Asset */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload Aset Digital Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Judul Dokumen / Video</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tipe Aset</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-slate-900 dark:text-white"
                >
                  <option value="E-book">E-book (PDF)</option>
                  <option value="Jurnal">Jurnal Akademik</option>
                  <option value="Video">Video Tutorial</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Penulis / Sumber</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-500">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 text-white font-bold gradient-btn rounded-xl">
                  Simpan Aset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
