import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LiveClassSession } from '../../types';
import { 
  Video, 
  Calendar, 
  Clock, 
  Plus, 
  ExternalLink, 
  Radio, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  Users, 
  X,
  Send,
  BellRing,
  Trash2,
  Lock,
  Link as LinkIcon,
  Play,
  Square,
  CheckCircle2
} from 'lucide-react';

export const LiveClassPage: React.FC = () => {
  const { liveClasses, addLiveClass, toggleLiveStatus, deleteLiveClass, currentRole } = useApp();

  const [activeCallSession, setActiveCallSession] = useState<LiveClassSession | null>(null);
  const [showAddLiveModal, setShowAddLiveModal] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  
  // Simulated WebRTC chat messages
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Dr. Robert Fox', text: 'Selamat datang di sesi Live WebRTC! Silakan ajukan pertanyaan di kolom chat ini.', time: '15:01' },
    { sender: 'Jacob Jones', text: 'Halo Pak, apakah slides presentasi sudah diunggah?', time: '15:03' }
  ]);
  const [inputChat, setInputChat] = useState('');

  // New Live Class Form States
  const [newTitle, setNewTitle] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('Frontend Web Development');
  const [newTime, setNewTime] = useState('16:00 WIB Hari Ini');
  const [newPlatform, setNewPlatform] = useState<'Zoom' | 'Google Meet' | 'Custom WebRTC'>('Google Meet');
  const [newLink, setNewLink] = useState('https://meet.google.com/abc-defg-hij');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;
    setChatMessages(prev => [
      ...prev,
      {
        sender: currentRole === 'admin' ? 'Administrator' : currentRole === 'teacher' ? 'Dr. Robert Fox' : 'Jacob Jones',
        text: inputChat,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputChat('');
  };

  const handleCreateLiveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addLiveClass({
      title: newTitle.trim(),
      courseTitle: newCourseTitle.trim(),
      teacherName: 'Dr. Robert Fox',
      scheduledTime: newTime.trim() || '16:00 WIB Hari Ini',
      durationMinutes: 90,
      platform: newPlatform,
      link: newLink.trim() || (newPlatform === 'Zoom' ? 'https://zoom.us/j/123456789' : newPlatform === 'Google Meet' ? 'https://meet.google.com/abc-defg-hij' : 'https://meet.skillset.edu/room-live'),
      isLiveNow: false, // Default scheduled, teacher/admin activates live manually
      startsInMinutes: 15
    });

    setShowAddLiveModal(false);
    setNewTitle('');
    setNewLink('https://meet.google.com/abc-defg-hij');
  };

  const activeLiveSession = liveClasses.find(s => s.isLiveNow);

  return (
    <div className="space-y-6">
      {/* 15-Minute Reminder Notification Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <BellRing className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-white/30 text-[10px] font-bold uppercase tracking-wider">
                Pengingat Sistem Live Class
              </span>
              {activeLiveSession && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
            </div>
            <h3 className="font-extrabold text-sm mt-0.5">
              {activeLiveSession 
                ? `🔴 SEDANG LIVE: ${activeLiveSession.title}` 
                : 'Kelas Interactive WebRTC Live Workshop Dimulai Dalam 15 Menit!'}
            </h3>
          </div>
        </div>

        {activeLiveSession ? (
          <button
            onClick={() => {
              if (activeLiveSession.platform === 'Custom WebRTC') {
                setActiveCallSession(activeLiveSession);
              } else {
                window.open(activeLiveSession.link, '_blank');
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-white text-red-600 font-bold text-xs shadow-md hover:bg-slate-50 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>Gabung Sesi Live Sekarang</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="text-xs font-semibold bg-white/20 px-3 py-1.5 rounded-xl">
            Menunggu Pengajar/Admin Memulai Live
          </span>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Video className="w-7 h-7 text-red-500" />
            <span>Live Class (Sesi Synchronous)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Penjadwalan Sesi Sinkron, Kontrol Status Live (Pengajar/Admin), dan Integrasi Meeting Link
          </p>
        </div>

        {(currentRole === 'admin' || currentRole === 'teacher') && (
          <button
            onClick={() => setShowAddLiveModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-btn shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>+ Jadwalkan Live Class Baru</span>
          </button>
        )}
      </div>

      {/* Live Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {liveClasses.map((session) => {
          const canJoin = session.isLiveNow;
          const isTeacherOrAdmin = currentRole === 'admin' || currentRole === 'teacher';

          return (
            <div
              key={session.id}
              className={`p-6 rounded-3xl border transition-all relative space-y-5 ${
                session.isLiveNow
                  ? 'bg-white dark:bg-slate-900 border-red-500 shadow-xl shadow-red-500/10 ring-2 ring-red-500/20'
                  : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {/* Card Header: Live Status Pill & Platform */}
              <div className="flex items-center justify-between gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                  session.isLiveNow 
                    ? 'bg-red-50 text-red-600 dark:bg-red-950/80 dark:text-red-300 border border-red-200 dark:border-red-800' 
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {session.isLiveNow ? (
                    <>
                      <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
                      <span>SEDANG BERLANGSUNG (LIVE)</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Terjadwal / Belum Dimulai</span>
                    </>
                  )}
                </span>

                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900">
                  {session.platform}
                </span>
              </div>

              {/* Course Title & Details */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {session.courseTitle}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                  {session.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{session.scheduledTime} ({session.durationMinutes} Menit)</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pengajar: <strong>{session.teacherName}</strong></span>
                </p>
                
                {/* Meeting Link Preview */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <LinkIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="font-mono text-[11px] truncate max-w-xs">{session.link}</span>
                </div>
              </div>

              {/* Teacher/Admin Control Actions: Live Selector & Delete Session */}
              {isTeacherOrAdmin && (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Kontrol Sesi:</span>
                    <button
                      onClick={() => toggleLiveStatus(session.id)}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] flex items-center gap-1.5 transition-all shadow-sm ${
                        session.isLiveNow
                          ? 'bg-amber-500 text-white hover:bg-amber-600'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {session.isLiveNow ? (
                        <>
                          <Square className="w-3 h-3 fill-current" />
                          <span>Hentikan Live</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Set Sesi Live Sekarang</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Delete Session Button */}
                  <button
                    onClick={() => {
                      if (confirm(`Apakah Anda yakin ingin menghapus sesi live class "${session.title}"?`)) {
                        deleteLiveClass(session.id);
                      }
                    }}
                    title="Hapus Sesi Live Class"
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors flex items-center gap-1 text-xs font-semibold"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <span>Hapus Sesi</span>
                  </button>
                </div>
              )}

              {/* Join Meeting Action Bar */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 font-medium">
                  {canJoin ? '🟢 Sesi Live Aktif' : '🔒 Live Belum Diaktifkan'}
                </span>

                {/* Join Meeting Button - Clickable ONLY when isLiveNow === true */}
                <button
                  disabled={!canJoin}
                  onClick={() => {
                    if (!canJoin) return;
                    if (session.platform === 'Custom WebRTC') {
                      setActiveCallSession(session);
                    } else {
                      window.open(session.link, '_blank');
                    }
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                    canJoin
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-indigo-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-75'
                  }`}
                >
                  {canJoin ? (
                    <>
                      <span>Gabung Pertemuan</span>
                      <ExternalLink className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Belum Dimulai (Menunggu Live)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive WebRTC Live Call Simulator Modal */}
      {activeCallSession && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in zoom-in-95 duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Call Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <div>
                  <h3 className="font-bold text-sm text-white">{activeCallSession.title}</h3>
                  <p className="text-[11px] text-slate-400">WebRTC Live Room • {activeCallSession.courseTitle}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveCallSession(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Main Body + Chat Sidebar Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              
              {/* Simulated Video Stage (Left 8 Cols) */}
              <div className="lg:col-span-8 bg-black relative flex flex-col items-center justify-center p-4">
                
                {/* Main Speaker Stage */}
                <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-850 relative flex items-center justify-center border border-slate-800">
                  {isVideoOn ? (
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80"
                      alt="Instructor Video Feed"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="w-20 h-20 rounded-full bg-indigo-600 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-lg">
                        RF
                      </div>
                      <p className="text-xs text-slate-400">Kamera dimatikan</p>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Dr. Robert Fox (Pengajar Utama)</span>
                  </div>
                </div>

                {/* Self Webcam PiP */}
                <div className="absolute top-8 right-8 w-36 h-24 rounded-xl overflow-hidden border-2 border-indigo-500/50 shadow-2xl bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                    alt="Self Video Feed"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1 text-[9px] bg-black/70 text-white px-1.5 py-0.5 rounded font-bold">
                    Anda ({currentRole})
                  </div>
                </div>
              </div>

              {/* Live Chat & Participants Sidebar (Right 4 Cols) */}
              <div className="lg:col-span-4 bg-slate-900 border-l border-slate-800 flex flex-col justify-between">
                
                {/* Chat Header */}
                <div className="p-3 border-b border-slate-800 flex items-center gap-2 text-xs font-bold text-white">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Obrolan Live Class (Chat)</span>
                </div>

                {/* Message Log */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-indigo-400">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="p-2.5 rounded-xl bg-slate-800 text-slate-200 leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={inputChat}
                    onChange={(e) => setInputChat(e.target.value)}
                    placeholder="Tulis pesan..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button type="submit" className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>
            </div>

            {/* Call Control Toolbar */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-4">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-full transition-colors ${
                  isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500 text-white'
                }`}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full transition-colors ${
                  isVideoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500 text-white'
                }`}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setActiveCallSession(null)}
                className="px-6 py-3 rounded-full bg-red-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Akhiri Sesi</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Schedule Live Class */}
      {showAddLiveModal && (
        <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center p-4 sm:p-6 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Jadwalkan Live Class Baru</h3>
              <button onClick={() => setShowAddLiveModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLiveSession} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Judul Sesi Live *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Hands-on Code Review & QnA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mata Pelajaran / Kursus</label>
                <input
                  type="text"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Waktu Sesi</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="16:00 WIB Hari Ini"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Platform Video Conference</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Google Meet">Google Meet</option>
                  <option value="Zoom">Zoom Meeting</option>
                  <option value="Custom WebRTC">Custom WebRTC (Built-in)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Link Pertemuan (Meeting Link) *</span>
                </label>
                <input
                  type="url"
                  required
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij atau https://zoom.us/j/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowAddLiveModal(false)} className="px-4 py-2 text-slate-500 font-semibold">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 text-white font-bold gradient-btn rounded-xl">
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
