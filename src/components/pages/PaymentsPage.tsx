import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types';
import { 
  CreditCard, 
  Plus, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  X, 
  DollarSign, 
  FileText,
  Search,
  ExternalLink,
  Eye,
  Users,
  CheckCircle2,
  Image as ImageIcon,
  Camera,
  Trash2
} from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { invoices, addInvoice, updateInvoiceStatus, deleteInvoiceByCode, currentRole, searchQuery, profiles, currentUser } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all'); // 'all' or 'overdue'
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [showUploadProofModal, setShowUploadProofModal] = useState<Invoice | null>(null);
  const [viewReceiptPhotoUrl, setViewReceiptPhotoUrl] = useState<string | null>(null);
  
  // Selected tagihan/invoice group for Admin/Guru detail view modal
  const [selectedTagihanCode, setSelectedTagihanCode] = useState<string | null>(null);
  const [studentSearchModal, setStudentSearchModal] = useState<string>('');
  const [studentStatusFilterModal, setStudentStatusFilterModal] = useState<string>('all');

  // Add invoice form state
  const [newStudentId, setNewStudentId] = useState('all'); // 'all' or specific student id
  const [newTitle, setNewTitle] = useState('SPP Bulan September 2026');
  const [newCategory, setNewCategory] = useState<'SPP' | 'Kursus' | 'Pendaftaran' | 'Lainnya'>('SPP');
  const [newAmount, setNewAmount] = useState(750000);
  const [newDueDate, setNewDueDate] = useState('2026-09-15');

  // Proof upload form state
  const [proofUrl, setProofUrl] = useState('');
  const [receiptImagePreview, setReceiptImagePreview] = useState<string>('');

  const isStaff = currentRole === 'admin' || currentRole === 'teacher';
  const studentListProfiles = profiles.filter(p => p.role === 'student');

  // Group invoices for Staff (Admin/Guru) by invoiceCode / title
  const uniqueBillingGroups = React.useMemo(() => {
    const map = new Map<string, {
      invoiceCode: string;
      title: string;
      category: Invoice['category'];
      amount: number;
      dueDate: string;
      createdAt: string;
      items: Invoice[];
    }>();

    invoices.forEach(inv => {
      const key = inv.invoiceCode || inv.title;
      if (!map.has(key)) {
        map.set(key, {
          invoiceCode: inv.invoiceCode,
          title: inv.title,
          category: inv.category,
          amount: inv.amount,
          dueDate: inv.dueDate,
          createdAt: inv.createdAt,
          items: []
        });
      }
      map.get(key)!.items.push(inv);
    });

    return Array.from(map.values());
  }, [invoices]);

  // Filtered Billing Groups for Staff
  const filteredBillingGroups = uniqueBillingGroups.filter(group => {
    const matchesSearch = group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          group.invoiceCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (statusFilter === 'overdue') {
      const isOverdue = group.items.some(i => i.status === 'overdue') || 
                        (new Date(group.dueDate) < new Date() && group.items.some(i => i.status !== 'paid'));
      return isOverdue;
    }

    return true;
  });

  // Comprehensive Student Invoices (display ALL billing items created by admin/guru to the student)
  const studentBillingDisplayList = React.useMemo(() => {
    return uniqueBillingGroups.map(group => {
      // Find if student already has a specific invoice item for this tagihan group
      const existingInv = group.items.find(inv => 
        inv.studentId === currentUser.id || inv.studentName.toLowerCase() === currentUser.fullName.toLowerCase()
      );

      if (existingInv) {
        return existingInv;
      }

      // If not, construct virtual student invoice record so ALL admin/guru tagihan are visible
      return {
        id: `auto-${group.invoiceCode}-${currentUser.id}`,
        invoiceCode: group.invoiceCode,
        studentId: currentUser.id,
        studentName: currentUser.fullName,
        studentEmail: currentUser.email,
        title: group.title,
        category: group.category,
        amount: group.amount,
        dueDate: group.dueDate,
        status: (new Date(group.dueDate) < new Date() ? 'overdue' : 'unpaid') as Invoice['status'],
        createdAt: group.createdAt
      };
    });
  }, [uniqueBillingGroups, currentUser, invoices]);

  // Filtered Invoices for Student view
  const filteredStudentInvoices = studentBillingDisplayList.filter(inv => {
    const matchesSearch = inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.invoiceCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (statusFilter === 'overdue') {
      return inv.status === 'overdue' || (new Date(inv.dueDate) < new Date() && inv.status !== 'paid');
    }

    return true;
  });

  // Handle new invoice issuance by Admin
  const handleIssueInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const masterCode = `INV-2026-0${Math.floor(800 + Math.random() * 99)}`;

    if (newStudentId === 'all') {
      studentListProfiles.forEach(st => {
        addInvoice({
          invoiceCode: masterCode,
          studentId: st.id,
          studentName: st.fullName,
          studentEmail: st.email,
          title: newTitle,
          category: newCategory,
          amount: Number(newAmount),
          dueDate: newDueDate,
          status: 'unpaid'
        });
      });
    } else {
      const st = studentListProfiles.find(s => s.id === newStudentId);
      if (st) {
        addInvoice({
          invoiceCode: masterCode,
          studentId: st.id,
          studentName: st.fullName,
          studentEmail: st.email,
          title: newTitle,
          category: newCategory,
          amount: Number(newAmount),
          dueDate: newDueDate,
          status: 'unpaid'
        });
      }
    }

    setShowAddInvoiceModal(false);
  };

  // Handle image file selection for receipt photo
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setReceiptImagePreview(result);
        setProofUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle proof / receipt upload submission
  const handleUploadProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showUploadProofModal) return;

    const finalProofUrl = receiptImagePreview || proofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80';

    // Find if an actual invoice object exists in invoices array matching this modal item or code
    const existingRealInv = invoices.find(inv => 
      inv.id === showUploadProofModal.id || 
      (inv.invoiceCode === showUploadProofModal.invoiceCode && (inv.studentId === currentUser.id || inv.studentName.toLowerCase() === currentUser.fullName.toLowerCase()))
    );

    if (existingRealInv) {
      updateInvoiceStatus(
        existingRealInv.id, 
        'pending', 
        finalProofUrl
      );
    } else {
      // Add invoice preserving the EXACT invoiceCode so it goes into the existing tagihan group
      addInvoice({
        invoiceCode: showUploadProofModal.invoiceCode,
        studentId: currentUser.id,
        studentName: currentUser.fullName,
        studentEmail: currentUser.email,
        title: showUploadProofModal.title,
        category: showUploadProofModal.category,
        amount: showUploadProofModal.amount,
        dueDate: showUploadProofModal.dueDate,
        status: 'pending',
        proofUrl: finalProofUrl
      });
    }

    setShowUploadProofModal(null);
    setProofUrl('');
    setReceiptImagePreview('');
  };

  // Selected Group items for Detail Modal
  const activeDetailGroup = selectedTagihanCode 
    ? uniqueBillingGroups.find(g => g.invoiceCode === selectedTagihanCode || g.title === selectedTagihanCode)
    : null;

  const modalStudentItems = activeDetailGroup ? activeDetailGroup.items.filter(inv => {
    const matchesSearch = inv.studentName.toLowerCase().includes(studentSearchModal.toLowerCase()) ||
                          inv.studentEmail.toLowerCase().includes(studentSearchModal.toLowerCase());
    if (!matchesSearch) return false;

    if (studentStatusFilterModal === 'paid') return inv.status === 'paid';
    if (studentStatusFilterModal === 'pending') return inv.status === 'pending';
    if (studentStatusFilterModal === 'unpaid') return inv.status === 'unpaid' || inv.status === 'overdue';

    return true;
  }) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Payments (Manajemen Pembayaran & Penagihan)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Penerbitan tagihan SPP & kursus, verifikasi bukti transfer, dan rincian status pembayaran siswa
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setShowAddInvoiceModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-btn shadow-md hover:opacity-95 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>+ Terbitkan Tagihan Baru</span>
          </button>
        )}
      </div>

      {/* Filter Tabs - ONLY 'Semua Tagihan' & 'Overdue' */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { key: 'all', label: 'Semua Tagihan' },
          { key: 'overdue', label: 'Overdue' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-5 py-2.5 rounded-xl capitalize transition-all ${
              statusFilter === tab.key
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ADMIN & GURU TABLE VIEW */}
      {isStaff ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="py-4 px-6">Kode & Rincian Tagihan</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Nominal</th>
                  <th className="py-4 px-6">Tenggat Waktu</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredBillingGroups.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Tidak ada data tagihan yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredBillingGroups.map((group) => (
                    <tr key={group.invoiceCode || group.title} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block text-sm">{group.title}</span>
                          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">{group.invoiceCode}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {group.category}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white text-sm">
                        Rp {group.amount.toLocaleString('id-ID')}
                      </td>

                      <td className="py-4 px-6 text-slate-500 font-medium">
                        {group.dueDate}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedTagihanCode(group.invoiceCode || group.title);
                              setStudentSearchModal('');
                              setStudentStatusFilterModal('all');
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors border border-indigo-200/50 dark:border-indigo-800/50"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Detail Pembayaran</span>
                          </button>
                          {currentRole === 'admin' && (
                            <button
                              onClick={() => {
                                if (confirm(`Hapus tagihan "${group.title}" (${group.invoiceCode})?`)) {
                                  deleteInvoiceByCode(group.invoiceCode);
                                }
                              }}
                              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                              title="Hapus Tagihan Ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* STUDENT TABLE VIEW (Tampilkan SEMUA Data Pembayaran yang Dibuat Admin/Guru) */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="py-4 px-6">Kode & Rincian Tagihan</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Nominal</th>
                  <th className="py-4 px-6">Tenggat Waktu</th>
                  <th className="py-4 px-6">Status Saya</th>
                  <th className="py-4 px-6 text-right">Aksi Pembayaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredStudentInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Tidak ada tagihan pembayaran yang tersedia.
                    </td>
                  </tr>
                ) : (
                  filteredStudentInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block text-sm">{inv.title}</span>
                          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">{inv.invoiceCode}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {inv.category}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white text-sm">
                        Rp {inv.amount.toLocaleString('id-ID')}
                      </td>

                      <td className="py-4 px-6 text-slate-500 font-medium">
                        {inv.dueDate}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800' :
                          inv.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/50 dark:border-amber-800' :
                          inv.status === 'overdue' ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/50 dark:border-red-800' :
                          'bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {inv.status === 'paid' && <CheckCircle className="w-3 h-3" />}
                          {inv.status === 'pending' && <Clock className="w-3 h-3" />}
                          {inv.status === 'overdue' && <AlertCircle className="w-3 h-3" />}
                          <span>{inv.status === 'paid' ? 'Lunas' : inv.status === 'pending' ? 'Pending Verifikasi' : inv.status === 'overdue' ? 'Overdue' : 'Belum Membayar'}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(inv.status === 'unpaid' || inv.status === 'overdue') && (
                            <button
                              onClick={() => {
                                setShowUploadProofModal(inv);
                                setReceiptImagePreview('');
                                setProofUrl('');
                              }}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 transition-colors"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Bayar / Upload Receipt</span>
                            </button>
                          )}
                          
                          {inv.proofUrl && (
                            <button
                              onClick={() => setViewReceiptPhotoUrl(inv.proofUrl || null)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100"
                              title="Lihat Resi Pembayaran Saya"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>Lihat Resi</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: DETAIL PEMBAYARAN & LIST SISWA (FOR ADMIN / GURU) */}
      {selectedTagihanCode && activeDetailGroup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-bold text-[11px]">
                    {activeDetailGroup.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{activeDetailGroup.invoiceCode}</span>
                </div>
                <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mt-1">
                  Detail Pembayaran: {activeDetailGroup.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Nominal: <strong className="text-slate-900 dark:text-white">Rp {activeDetailGroup.amount.toLocaleString('id-ID')}</strong> • Tenggat Waktu: {activeDetailGroup.dueDate}
                </p>
              </div>
              <button 
                onClick={() => setSelectedTagihanCode(null)} 
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <p className="text-[11px] text-slate-400 font-medium">Total Siswa</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{activeDetailGroup.items.length}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40">
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Sudah Membayar</p>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {activeDetailGroup.items.filter(i => i.status === 'paid').length}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40">
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Menunggu Verifikasi</p>
                <p className="text-lg font-black text-amber-600 dark:text-amber-400">
                  {activeDetailGroup.items.filter(i => i.status === 'pending').length}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-200/50 dark:border-red-900/40">
                <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">Belum / Overdue</p>
                <p className="text-lg font-black text-red-600 dark:text-red-400">
                  {activeDetailGroup.items.filter(i => i.status === 'unpaid' || i.status === 'overdue').length}
                </p>
              </div>
            </div>

            {/* Filter & Search inside Modal */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama atau email siswa..."
                  value={studentSearchModal}
                  onChange={(e) => setStudentSearchModal(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px] font-semibold">
                {[
                  { key: 'all', label: 'Semua' },
                  { key: 'paid', label: 'Sudah Membayar' },
                  { key: 'pending', label: 'Pending' },
                  { key: 'unpaid', label: 'Belum Membayar' }
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setStudentStatusFilterModal(st.key)}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      studentStatusFilterModal === st.key
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Student Payment List Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full min-w-[550px] text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800/90 backdrop-blur-sm text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                  <tr>
                    <th className="py-3 px-4">Nama Siswa</th>
                    <th className="py-3 px-4">Status Pembayaran</th>
                    <th className="py-3 px-4">Bukti Transfer</th>
                    <th className="py-3 px-4 text-right">Aksi Konfirmasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {modalStudentItems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400">
                        Tidak ada siswa dengan kriteria filter tersebut.
                      </td>
                    </tr>
                  ) : (
                    modalStudentItems.map((inv) => {
                      const studentProf = profiles.find(p => p.id === inv.studentId || p.fullName.toLowerCase() === inv.studentName.toLowerCase());
                      const avatar = studentProf?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

                      return (
                        <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img src={avatar} alt={inv.studentName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">{inv.studentName}</p>
                                <p className="text-[10px] text-slate-400">{inv.studentEmail}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' :
                              inv.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                              inv.status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' :
                              'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}>
                              {inv.status === 'paid' && <CheckCircle className="w-3 h-3" />}
                              {inv.status === 'pending' && <Clock className="w-3 h-3" />}
                              {inv.status === 'overdue' && <AlertCircle className="w-3 h-3" />}
                              <span>
                                {inv.status === 'paid' ? 'Sudah Membayar' : inv.status === 'pending' ? 'Pending Verifikasi' : inv.status === 'overdue' ? 'Overdue' : 'Belum Membayar'}
                              </span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            {inv.proofUrl ? (
                              <button
                                onClick={() => setViewReceiptPhotoUrl(inv.proofUrl || null)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-semibold text-[11px] hover:underline"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>Lihat Resi</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Belum upload</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            {inv.status === 'paid' ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                                <CheckCircle2 className="w-4 h-4" /> Lunas
                              </span>
                            ) : (
                              <button
                                onClick={() => updateInvoiceStatus(inv.id, 'paid')}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 shadow-sm transition-colors"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Konfirmasi Lunas</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTagihanCode(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TERBITKAN TAGIHAN BARU (FOR ADMIN) */}
      {showAddInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Terbitkan Tagihan Baru</h3>
              <button onClick={() => setShowAddInvoiceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Siswa</label>
                <select
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-slate-900 dark:text-white"
                >
                  <option value="all">Semua Siswa Aktif ({studentListProfiles.length} Siswa)</option>
                  {studentListProfiles.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.studentId || s.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Judul Penagihan</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-slate-900 dark:text-white"
                  >
                    <option value="SPP">SPP</option>
                    <option value="Kursus">Kursus</option>
                    <option value="Pendaftaran">Pendaftaran</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tenggat Waktu</label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowAddInvoiceModal(false)} className="px-4 py-2 text-slate-500">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 text-white font-bold gradient-btn rounded-xl">
                  Terbitkan Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: UPLOAD FOTO RECEIPT / RESI PEMBAYARAN (FOR STUDENT) */}
      {showUploadProofModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload Foto Receipt Pembayaran</h3>
              </div>
              <button 
                onClick={() => {
                  setShowUploadProofModal(null);
                  setReceiptImagePreview('');
                  setProofUrl('');
                }} 
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadProof} className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 space-y-1">
                <p className="font-bold text-slate-900 dark:text-white text-sm">{showUploadProofModal.title}</p>
                <p className="text-xs text-slate-500">Kode Tagihan: {showUploadProofModal.invoiceCode}</p>
                <p className="text-indigo-600 dark:text-indigo-400 font-black text-base pt-1">
                  Total: Rp {showUploadProofModal.amount.toLocaleString('id-ID')}
                </p>
              </div>

              {/* Upload Foto Resi / Screenshot Box */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Upload Foto Receipt / Bukti Resi Transfer <span className="text-red-500">*</span>
                </label>
                
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-indigo-500 transition-colors bg-slate-50 dark:bg-slate-800/50">
                  {receiptImagePreview ? (
                    <div className="space-y-3">
                      <img 
                        src={receiptImagePreview} 
                        alt="Preview Foto Receipt" 
                        className="max-h-44 w-full object-contain rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
                      />
                      <div className="flex items-center justify-center gap-2">
                        <label className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs cursor-pointer hover:bg-indigo-100">
                          Ganti Foto
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageFileChange} 
                            className="hidden" 
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setReceiptImagePreview('');
                            setProofUrl('');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-3">
                      <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <Camera className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">Klik untuk Pilih Foto Receipt / Resi</p>
                        <p className="text-[11px] text-slate-400">Format gambar: JPG, PNG, WEBP</p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageFileChange} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Alternative Image URL Fallback */}
              <div>
                <label className="block font-bold text-slate-500 text-[11px] mb-1">
                  Atau masukkan URL Foto Receipt (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="https://... URL gambar resi"
                  value={proofUrl}
                  onChange={(e) => {
                    setProofUrl(e.target.value);
                    setReceiptImagePreview(e.target.value);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowUploadProofModal(null);
                    setReceiptImagePreview('');
                    setProofUrl('');
                  }} 
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={!receiptImagePreview && !proofUrl}
                  className={`px-5 py-2 text-white font-bold rounded-xl shadow-md transition-all ${
                    receiptImagePreview || proofUrl 
                      ? 'gradient-btn hover:opacity-95' 
                      : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
                  }`}
                >
                  Kirim Bukti Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: VIEW RECEIPT PHOTO POPUP */}
      {viewReceiptPhotoUrl && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-600" />
                Foto Resi / Bukti Transfer
              </h3>
              <button 
                onClick={() => setViewReceiptPhotoUrl(null)} 
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center p-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-hidden max-h-96">
              <img 
                src={viewReceiptPhotoUrl} 
                alt="Foto Resi Pembayaran" 
                className="max-h-80 w-auto object-contain rounded-xl shadow-sm"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <a
                href={viewReceiptPhotoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" /> Buka Ukuran Penuh
              </a>
              <button
                onClick={() => setViewReceiptPhotoUrl(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
