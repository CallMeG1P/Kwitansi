import { useState, useMemo } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { createKwitansi } from '../lib/api';
import { konversiTerbilangLengkap } from '../lib/terbilang';
import type { KwitansiType } from '../lib/types';

interface ReceiptFormProps {
  onSaved: () => void;
  onCancel: () => void;
}

export function ReceiptForm({ onSaved, onCancel }: ReceiptFormProps) {
  const [type, setType] = useState<KwitansiType>('lebur');
  const [no, setNo] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [tanggalPutaran, setTanggalPutaran] = useState('');
  const [terimaDari, setTerimaDari] = useState('');
  const [modal, setModal] = useState('');
  const [hargaBeli1Gr, setHargaBeli1Gr] = useState('');
  const [totalSebelumLebur, setTotalSebelumLebur] = useState('');
  const [totalSetelahLebur, setTotalSetelahLebur] = useState('');
  const [kadar, setKadar] = useState('91.99%');
  const [hargaBeliGram, setHargaBeliGram] = useState('');
  const [hargaJualGram, setHargaJualGram] = useState('');
  const [totalPenjualan, setTotalPenjualan] = useState('');
  const [totalKeuntungan, setTotalKeuntungan] = useState('');
  const [loading, setLoading] = useState(false);

  // Derived calculations
  const calc = useMemo(() => {
    const tp = parseFloat(totalPenjualan) || 0;
    const tk = parseFloat(totalKeuntungan) || 0;
    const jumlah30 = tk * 0.30;
    const terbilang = konversiTerbilangLengkap(jumlah30);
    return { tp, tk, jumlah30, terbilang };
  }, [totalPenjualan, totalKeuntungan]);

  function hitungOtomatis() {
    if (type === 'lebur') {
      const tp = parseFloat(totalPenjualan) || 0;
      const hb1 = parseFloat(hargaBeli1Gr) || 0;
      const tsl = parseFloat(totalSetelahLebur) || 0;
      if (tp > 0) {
        const hargaBeliEst = tsl * hb1;
        const tk = tp - hargaBeliEst;
        setTotalKeuntungan(tk.toFixed(2));
      }
    } else {
      const m = parseFloat(modal) || 0;
      const hbg = parseFloat(hargaBeliGram) || 0;
      const hjg = parseFloat(hargaJualGram) || 0;
      if (m > 0 && hbg > 0 && hjg > 0) {
        const totalPembelianGr = m / hbg;
        const tp = totalPembelianGr * hjg;
        setTotalPenjualan(tp.toFixed(2));
        const tk = tp - m;
        setTotalKeuntungan(tk.toFixed(2));
      }
    }
  }

  function onFieldChange(field: string, val: string) {
    const setters: Record<string, (v: string) => void> = {
      modal: setModal,
      hargaBeli1Gr: setHargaBeli1Gr,
      totalSetelahLebur: setTotalSetelahLebur,
      totalPenjualan: setTotalPenjualan,
      totalKeuntungan: setTotalKeuntungan,
      hargaBeliGram: setHargaBeliGram,
      hargaJualGram: setHargaJualGram,
    };
    if (setters[field]) {
      setters[field](val);
      // Recalculate after state update
      setTimeout(hitungOtomatis, 0);
    }
  }

  async function handleSave() {
    setLoading(true);
    const id = 'KWT-' + Date.now();
    try {
      let row: (string | number)[] = [];
      if (type === 'lebur') {
        row = [
          id, no, tanggal, tanggalPutaran, terimaDari,
          calc.jumlah30.toFixed(2), calc.terbilang,
          modal, hargaBeli1Gr, totalSebelumLebur, totalSetelahLebur, kadar,
          (parseFloat(totalSetelahLebur) || 0) * (parseFloat(hargaBeli1Gr) || 0),
          totalPenjualan, totalKeuntungan, calc.jumlah30.toFixed(2),
        ];
      } else {
        const m = parseFloat(modal) || 0;
        const hb = parseFloat(hargaBeliGram) || 1;
        row = [
          id, no, tanggal, tanggalPutaran, terimaDari,
          calc.jumlah30.toFixed(2), calc.terbilang,
          m, hb, (m / hb).toFixed(2), m,
          hargaJualGram, totalPenjualan, totalKeuntungan, calc.jumlah30.toFixed(2),
        ];
      }
      await createKwitansi(type, row);
      alert('Berhasil menyimpan kwitansi!');
      onSaved();
    } catch (err) {
      alert('Gagal menyimpan kwitansi: ' + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in-up">
      <h3 className="text-base font-semibold" style={{ margin: '0 0 2px 0' }}>Tambah Kwitansi Baru</h3>
      <p className="text-sm text-muted mb-5">Isi rincian transaksi, kalkulasi akan terisi otomatis.</p>

      <div className="max-w-[260px] mb-5">
        <Select
          label="Tipe Kwitansi"
          value={type}
          onChange={(e) => setType(e.target.value as KwitansiType)}
          options={[
            { value: 'lebur', label: 'Lebur' },
            { value: 'tak_lebur', label: 'Tak Lebur' },
          ]}
        />
      </div>

      <div className="grid gap-3.5 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <Input label="No. Kwitansi" type="text" value={no} onChange={(e) => setNo(e.target.value)} />
        <Input label="Tanggal Transfer/Bayar" type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
        <Input label="Tanggal Putaran" type="date" value={tanggalPutaran} onChange={(e) => setTanggalPutaran(e.target.value)} />
      </div>

      <div className="grid gap-3.5 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <Input label="Terima Dari" type="text" value={terimaDari} onChange={(e) => setTerimaDari(e.target.value)} />
        <Input label="Modal (Rp)" type="number" step="0.01" value={modal} onChange={(e) => onFieldChange('modal', e.target.value)} />
      </div>

      {type === 'lebur' && (
        <div className="grid gap-3.5 mb-4 animate-fade-in" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <Input label="Harga Beli 1 / gr (Rp)" type="number" step="0.01" value={hargaBeli1Gr} onChange={(e) => onFieldChange('hargaBeli1Gr', e.target.value)} />
          <Input label="Total Sebelum Lebur" type="number" step="0.01" value={totalSebelumLebur} onChange={(e) => setTotalSebelumLebur(e.target.value)} />
          <Input label="Total Setelah Lebur" type="number" step="0.01" value={totalSetelahLebur} onChange={(e) => onFieldChange('totalSetelahLebur', e.target.value)} />
          <Input label="Kadar (%)" type="text" value={kadar} onChange={(e) => setKadar(e.target.value)} />
        </div>
      )}

      {type === 'tak_lebur' && (
        <div className="grid gap-3.5 mb-4 animate-fade-in" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <Input label="Harga Beli / gram (Rp)" type="number" step="0.01" value={hargaBeliGram} onChange={(e) => onFieldChange('hargaBeliGram', e.target.value)} />
          <Input label="Harga Jual / gram (Rp)" type="number" step="0.01" value={hargaJualGram} onChange={(e) => onFieldChange('hargaJualGram', e.target.value)} />
        </div>
      )}

      <div className="grid gap-3.5 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <Input label="Total Penjualan (Rp)" type="number" step="0.01" value={totalPenjualan} onChange={(e) => onFieldChange('totalPenjualan', e.target.value)} />
        <Input label="Total Keuntungan (Rp)" type="number" step="0.01" value={totalKeuntungan} onChange={(e) => onFieldChange('totalKeuntungan', e.target.value)} placeholder="0" />
        <Input label="Total Keuntungan x 30% (Jumlah)" type="number" step="0.01" value={calc.jumlah30 !== 0 ? calc.jumlah30.toFixed(2) : '0'} readOnly />
      </div>

      <div className="mb-5">
        <Input label="Terbilang (Otomatis dari Total Keuntungan)" type="text" value={calc.terbilang} readOnly />
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button variant="success" size="auto" loading={loading} onClick={handleSave}>
          {loading ? 'Menyimpan...' : 'Simpan Kwitansi'}
        </Button>
        <Button variant="secondary" size="auto" onClick={onCancel}>Batal</Button>
      </div>
    </div>
  );
}
