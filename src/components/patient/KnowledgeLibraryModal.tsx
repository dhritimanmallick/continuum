import React, { useState } from 'react';
import { 
  BookOpen, 
  Video, 
  Search, 
  Sparkles, 
  Clock, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  X,
  Play,
  FileText,
  Bookmark,
  Share2
} from 'lucide-react';
import { KnowledgeDocument, KnowledgeVideoResource, KnowledgeCategory, KnowledgeChapter } from '../../types';
import { knowledgeLibraryService } from '../../services/knowledgeLibraryService';
import { AiKnowledgeCounsellorPanel } from './AiKnowledgeCounsellorPanel';

interface KnowledgeLibraryModalProps {
  initialCategory?: KnowledgeCategory;
  onClose: () => void;
  onOpenDoctorCounselling?: () => void;
}

const CATEGORIES: { key: KnowledgeCategory | 'ALL'; label: string; icon: string }[] = [
  { key: 'ALL', label: 'All Resources', icon: '📚' },
  { key: 'FIRST_TRIMESTER', label: '1st Trimester (0-13w)', icon: '🌱' },
  { key: 'SECOND_TRIMESTER', label: '2nd Trimester (14-27w)', icon: '🌸' },
  { key: 'THIRD_TRIMESTER', label: '3rd Trimester (28-40w)', icon: '🤰' },
  { key: 'LABOUR_AND_BIRTH', label: 'Labour & Childbirth', icon: '👶' },
  { key: 'POSTNATAL_CARE', label: 'Postnatal & Recovery', icon: '🤱' },
  { key: 'NEWBORN_CARE', label: 'Newborn Essentials', icon: '🍼' },
  { key: 'GYNECOLOGY', label: 'PCOS & Menstrual Health', icon: '🩺' },
  { key: 'HIGH_RISK_AWARENESS', label: 'High-Risk & Red Flags', icon: '⚠️' }
];

export const KnowledgeLibraryModal: React.FC<KnowledgeLibraryModalProps> = ({
  initialCategory,
  onClose,
  onOpenDoctorCounselling
}) => {
  const [activeTab, setActiveTab] = useState<'BOOKS' | 'VIDEOS' | 'AI_COUNSELLOR'>('BOOKS');
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | 'ALL'>(initialCategory || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Document / Chapter for in-app reader
  const [readingDoc, setReadingDoc] = useState<KnowledgeDocument | null>(null);
  const [readingChapterIndex, setReadingChapterIndex] = useState(0);

  // Selected Video for watching
  const [watchingVideo, setWatchingVideo] = useState<KnowledgeVideoResource | null>(null);

  const allDocs = knowledgeLibraryService.getAllDocuments();
  const allVideos = knowledgeLibraryService.getAllVideos();

  // Filtered documents
  const filteredDocs = allDocs.filter(d => {
    const matchesCat = selectedCategory === 'ALL' || d.category === selectedCategory;
    const matchesQuery = !searchQuery || 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  // Filtered videos
  const filteredVideos = allVideos.filter(v => {
    const matchesCat = selectedCategory === 'ALL' || v.category === selectedCategory;
    const matchesQuery = !searchQuery || 
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.transcript.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#faf8f6] rounded-3xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden text-xs">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-indigo-900/70 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center font-bold text-amber-300 text-base shadow-xs">
              <BookOpen className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">MEDICAL KNOWLEDGE LIBRARY</h3>
                <span className="text-[10px] bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded-full font-bold">
                  FOGSI · RCOG · WHO Grounded
                </span>
              </div>
              <p className="text-[11px] text-indigo-200 font-medium">
                Digital books, educational video counselling, and verified clinical guidance for mothers and families.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl font-bold text-xs">
            <button
              onClick={() => setActiveTab('BOOKS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'BOOKS' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Digital Books &amp; Guides ({filteredDocs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('VIDEOS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'VIDEOS' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-rose-500" />
              <span>Video Counselling ({filteredVideos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('AI_COUNSELLOR')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'AI_COUNSELLOR' 
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-xs' 
                  : 'text-purple-700 hover:text-purple-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask AI Counsellor (RAG)</span>
            </button>
          </div>

          {/* Search Box */}
          {activeTab !== 'AI_COUNSELLOR' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, symptoms, chapters..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-indigo-500 outline-hidden"
              />
            </div>
          )}
        </div>

        {/* Category Pill Filters */}
        {activeTab !== 'AI_COUNSELLOR' && (
          <div className="bg-slate-50/70 border-b border-slate-200 px-4 sm:px-6 py-2 overflow-x-auto flex items-center gap-1.5 shrink-0">
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition flex items-center gap-1 cursor-pointer ${
                    isSelected 
                      ? 'bg-indigo-900 text-white shadow-xs' 
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: DIGITAL BOOKS & GUIDES */}
          {activeTab === 'BOOKS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDocs.map(doc => (
                  <div
                    key={doc.id}
                    className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 transition-all shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md border border-indigo-100">
                            {doc.publisherOrSource} ({doc.editionYear})
                          </span>
                          {doc.isFeatured && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded-md">
                              ★ Recommended
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {doc.estimatedReadMinutes}m read
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 mt-2 hover:text-indigo-700 transition">
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">By {doc.author}</p>
                      
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {doc.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {doc.tags.map(t => (
                          <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">
                        {doc.chapters.length} Chapters included
                      </span>
                      <button
                        onClick={() => {
                          setReadingDoc(doc);
                          setReadingChapterIndex(0);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Read Book</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDocs.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500">
                  No reference material found matching "{searchQuery}".
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VIDEO COUNSELLING */}
          {activeTab === 'VIDEOS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredVideos.map(video => (
                  <div
                    key={video.id}
                    className="bg-white border border-slate-200 hover:border-rose-300 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      {/* Video Thumbnail Mock */}
                      <div className="relative aspect-video bg-slate-900 overflow-hidden group cursor-pointer" onClick={() => setWatchingVideo(video)}>
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {video.durationMinutes}:00
                        </span>
                      </div>

                      <div className="p-3.5">
                        <h4 className="text-xs font-black text-slate-900 leading-snug line-clamp-2">
                          {video.title}
                        </h4>
                        <p className="text-[11px] text-rose-700 font-bold mt-1">{video.speaker}</p>
                        <p className="text-[10px] text-slate-500">{video.speakerDesignation}</p>

                        <div className="mt-2.5 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Lessons</span>
                          {video.keyLessons.map((l, i) => (
                            <div key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                              <span className="text-emerald-500 font-bold">•</span>
                              <span className="line-clamp-2">{l}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 pt-0">
                      <button
                        onClick={() => setWatchingVideo(video)}
                        className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-800 hover:text-rose-800 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Watch &amp; Read Transcript</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AI COUNSELLOR (RAG) */}
          {activeTab === 'AI_COUNSELLOR' && (
            <AiKnowledgeCounsellorPanel onOpenDoctorCounselling={onOpenDoctorCounselling} />
          )}
        </div>

        {/* IN-APP BOOK READER MODAL */}
        {readingDoc && (
          <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-xs">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <div>
                    <h3 className="text-sm font-black">{readingDoc.title}</h3>
                    <p className="text-[10px] text-indigo-200">Chapter {readingDoc.chapters[readingChapterIndex].chapterNumber}: {readingDoc.chapters[readingChapterIndex].title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setReadingDoc(null)}
                  className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Chapter Tabs */}
              <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
                {readingDoc.chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => setReadingChapterIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition cursor-pointer ${
                      readingChapterIndex === idx 
                        ? 'bg-indigo-900 text-white shadow-xs' 
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    Ch. {ch.chapterNumber}: {ch.title.split(' ')[0]}...
                  </button>
                ))}
              </div>

              {/* Chapter Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Chapter {readingDoc.chapters[readingChapterIndex].chapterNumber}</span>
                  <h2 className="text-base font-black text-slate-900 mt-0.5">
                    {readingDoc.chapters[readingChapterIndex].title}
                  </h2>
                </div>

                <div className="text-slate-700 leading-relaxed text-sm bg-slate-50/60 p-4 rounded-2xl border border-slate-200">
                  {readingDoc.chapters[readingChapterIndex].content}
                </div>

                {/* Key Takeaways */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-emerald-900 font-black text-xs mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Clinical Key Takeaways</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-emerald-800">
                    {readingDoc.chapters[readingChapterIndex].keyTakeaways.map((takeaway, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-bold text-emerald-600">•</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Clinical Pearls if available */}
                {readingDoc.chapters[readingChapterIndex].clinicalPearls && (
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-purple-900 font-black text-xs mb-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>FOGSI / RCOG Practice Pearl</span>
                    </div>
                    <p className="text-xs text-purple-800 font-medium">
                      {readingDoc.chapters[readingChapterIndex].clinicalPearls![0]}
                    </p>
                  </div>
                )}

                {/* Warning Signs if available */}
                {readingDoc.chapters[readingChapterIndex].warningSigns && (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-rose-900 font-black text-xs mb-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>When to Alert Your Obstetrician (Red Flags)</span>
                    </div>
                    <ul className="space-y-1 text-xs text-rose-800">
                      {readingDoc.chapters[readingChapterIndex].warningSigns!.map((ws, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-rose-600 font-bold">⚠️</span>
                          <span>{ws}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Reader Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
                <button
                  disabled={readingChapterIndex === 0}
                  onClick={() => setReadingChapterIndex(prev => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-700 disabled:opacity-30 cursor-pointer"
                >
                  ← Previous Chapter
                </button>

                <span className="text-slate-500 font-medium text-[11px]">
                  Chapter {readingChapterIndex + 1} of {readingDoc.chapters.length}
                </span>

                <button
                  disabled={readingChapterIndex === readingDoc.chapters.length - 1}
                  onClick={() => setReadingChapterIndex(prev => Math.min(readingDoc.chapters.length - 1, prev + 1))}
                  className="px-3 py-1.5 rounded-lg bg-indigo-900 text-white font-bold disabled:opacity-30 cursor-pointer"
                >
                  Next Chapter →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WATCH VIDEO & READ TRANSCRIPT MODAL */}
        {watchingVideo && (
          <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-xs">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-400" />
                  <h3 className="text-sm font-bold truncate">{watchingVideo.title}</h3>
                </div>
                <button
                  onClick={() => setWatchingVideo(null)}
                  className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Simulated Player */}
                <div className="aspect-video bg-black rounded-2xl relative flex items-center justify-center overflow-hidden border border-slate-800">
                  <img src={watchingVideo.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute text-center text-white p-4">
                    <div className="w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center mx-auto mb-2 shadow-xl cursor-pointer hover:scale-105 transition">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                    <div className="font-bold text-sm">{watchingVideo.speaker}</div>
                    <div className="text-xs text-rose-200">{watchingVideo.speakerDesignation}</div>
                  </div>
                </div>

                {/* Key Lessons */}
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5">
                  <h4 className="font-bold text-rose-950 text-xs mb-2">Key Takeaways from the Doctor</h4>
                  <ul className="space-y-1 text-xs text-rose-800">
                    {watchingVideo.keyLessons.map((l, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Clinical Transcript */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Verified Clinical Video Transcript</span>
                  </h4>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-normal">
                    {watchingVideo.transcript}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
                <button
                  onClick={() => setWatchingVideo(null)}
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Close Video
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
