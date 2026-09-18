import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { getKwitansi, deleteKwitansi } from '../lib/api';
import { formatRupiah } from '../lib/terbilang';
import type { KwitansiData, KwitansiType, User } from '../lib/types';
import { Trash2, Eye, Inbox } from 'lucide-react';

interface ReceiptListProps {
  user: User;
  onView: (data: KwitansiData, type: KwitansiType) => void;
  refreshKey: number;
}

export function ReceiptList({ user, onView, refreshKey }: ReceiptListProps) {
  const [type, setType] = useState<KwitansiType>('lebur');
  const [data, setData] = useState<KwitansiData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const rows = await getKwitansi(type);
      setData(rows);
    } catch {
      setError('Gagal memuat data dari database.');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    loadData();
  }, [loadData, refreshKey]);

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus kwitansi ini?')) return;
    try {
      await deleteKwitansi(id, type);
      await loadData();
    } catch {
      alert('Gagal menghapus data!');
    }
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h3 className="text-base font-semibold" style={{ margin: 0 }}>Daftar Kwitansi Pembayaran</h3>
          <p className="text-sm text-muted" style={{ margin: '2px 0 0 0' }}>Kelola dan cetak kwitansi yang sudah tersimpan.</p>
        </div>
        <div className="w-auto min-w-[180px]">
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as KwitansiType)}
            options={[
              { value: 'lebur', label: 'Kwitansi Lebur' },
              { value: 'tak_lebur', label: 'Kwitansi Tak Lebur' },
            ]}
          />
        </div>
      </div>

      {error && (
        <div
          className="text-sm px-3 py-2 rounded-lg mb-4"
          style={{ color: 'var(--danger)', background: 'color-mix(in srgb, var(--danger) 8%, transparent)' }}
        >
          {error}
        </div>
      )}

      <div className="table-wrap">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="big-spinner" />
          </div>
        ) : data.length === 0 ? (
          <div className="empty-state flex flex-col items-center gap-2">
            <Inbox size={28} style={{ color: 'var(--text-faint)' }} />
            <span>Belum ada data kwitansi.</span>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Terima Dari</th>
                <th>Jumlah (30%)</th>
                <th>Total Keuntungan</th>
                <th style={{ width: 1 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td data-label="No">{row.no || '-'}</td>
                  <td data-label="Terima Dari">{row.terima_dari || '-'}</td>
                  <td data-label="Jumlah (30%)" className="num">{formatRupiah(row.jumlah)}</td>
                  <td data-label="Total Keuntungan" className="num">{formatRupiah(row.total_keuntungan)}</td>
                  <td data-label="Aksi" className="row-actions-cell">
                    <div className="row-actions">
                      <Button variant="secondary" size="sm" onClick={() => onView(row, type)}>
                        <Eye size={13} /> Lihat
                      </Button>
                      {user.role === 'admin' && (
                        <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>
                          <Trash2 size={13} /> Hapus
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
