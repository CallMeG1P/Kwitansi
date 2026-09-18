import { Button } from './ui/Button';
import { formatRupiah, formatTanggal } from '../lib/terbilang';
import type { KwitansiData, KwitansiType } from '../lib/types';
import { Printer, ArrowLeft } from 'lucide-react';

interface ReceiptPreviewProps {
  data: KwitansiData;
  type: KwitansiType;
  onBack: () => void;
}

export function ReceiptPreview({ data, type, onBack }: ReceiptPreviewProps) {
  let detailRows: { label: string; value: string; bold?: boolean }[] = [];

  if (type === 'lebur') {
    detailRows = [
      { label: 'Modal', value: formatRupiah(data.modal) },
      { label: 'Harga Beli 1 / gr', value: formatRupiah(data.harga_beli_gr || 0) },
      { label: 'Total Sebelum Lebur', value: String(data.total_sebelum_lebur || 0) },
      { label: 'Total Setelah Lebur', value: String(data.total_setelah_lebur || 0) },
      { label: 'Kadar', value: data.kadar || '' },
      { label: 'Harga Beli', value: formatRupiah(data.harga_beli || 0) },
      { label: 'Total Penjualan', value: formatRupiah(data.total_penjualan) },
      { label: 'Total Keuntungan', value: formatRupiah(data.total_keuntungan) },
      { label: 'Total Keuntungan x 30%', value: formatRupiah(data.total_keuntungan_30 || data.jumlah), bold: true },
    ];
  } else {
    detailRows = [
      { label: 'Modal', value: formatRupiah(data.modal) },
      { label: 'Harga Beli/gram', value: formatRupiah(data.harga_beli_gram || 0) },
      { label: 'Total Pembelian (gr)', value: String(data.total_pembelian_gr || 0) },
      { label: 'Total Pembelian', value: formatRupiah(data.total_pembelian || 0) },
      { label: 'Harga Jual/gram', value: formatRupiah(data.harga_jual_gram || 0) },
      { label: 'Total Penjualan', value: formatRupiah(data.total_penjualan) },
      { label: 'Total Keuntungan', value: formatRupiah(data.total_keuntungan) },
      { label: 'Total Keuntungan x 30%', value: formatRupiah(data.total_keuntungan_30 || data.jumlah), bold: true },
    ];
  }

  return (
    <div className="animate-fade-in">
      <div className="flex gap-2 mb-5 flex-wrap no-print">
        <Button variant="success" size="auto" onClick={() => window.print()}>
          <Printer size={15} /> Cetak / Download PDF
        </Button>
        <Button variant="secondary" size="auto" onClick={onBack}>
          <ArrowLeft size={15} /> Kembali
        </Button>
      </div>

      <div className="kwitansi-box print-container">
        <div className="kwitansi-title">Kwitansi Pembayaran</div>
        <div className="kwitansi-subtitle">Kwitansi Pembayaran</div>

        <table className="kwitansi-table">
          <tbody>
            <tr>
              <td colSpan={2}><strong>No.</strong> {data.no || ''}</td>
              <td colSpan={2}><strong>Tanggal Putaran:</strong> {formatTanggal(data.tanggal_putaran)}</td>
            </tr>
            <tr>
              <td colSpan={2}>
                <strong>{type === 'lebur' ? 'Tanggal:' : 'Tanggal Transfer :'}</strong> {formatTanggal(data.tanggal)}
              </td>
              <td colSpan={2}><strong>Terima dari:</strong> {data.terima_dari || ''}</td>
            </tr>
            <tr>
              <td style={{ width: '20%' }}><strong>Jumlah</strong></td>
              <td colSpan={3}><strong>{formatRupiah(data.jumlah)}</strong></td>
            </tr>
            <tr>
              <td><strong>Terbilang</strong></td>
              <td colSpan={3}><strong>{data.terbilang || ''}</strong></td>
            </tr>
            <tr>
              <td colSpan={4} className="bold">Untuk Pembayaran:</td>
            </tr>
          </tbody>
        </table>

        <table className="kwitansi-table">
          <tbody>
            {detailRows.map((r, i) => (
              <tr key={i}>
                <td>{r.label}</td>
                <td className="text-right" style={{ fontWeight: r.bold ? 600 : 400 }}>{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="signature-container">
          <div className="sig-box" style={{ flex: '2 1 220px', textAlign: 'left' }}>
            <strong>Detail Jumlah dan Perhitungan</strong>
          </div>
          <div className="sig-box">
            <strong>Tanda Tangan Penerima</strong>
          </div>
          <div className="sig-box">
            <strong>Tanda Tangan Penyetor</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
