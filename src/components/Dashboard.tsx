import { useState } from 'react';
import { Button } from './ui/Button';
import { ThemePicker } from './ThemePicker';
import { ReceiptList } from './ReceiptList';
import { ReceiptForm } from './ReceiptForm';
import { UserForm } from './UserForm';
import { ReceiptPreview } from './ReceiptPreview';
import type { User, KwitansiData, KwitansiType } from '../lib/types';
import { Plus, UserPlus, LogOut } from 'lucide-react';

type View = 'list' | 'formKwitansi' | 'formUser' | 'preview';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [view, setView] = useState<View>('list');
  const [previewData, setPreviewData] = useState<KwitansiData | null>(null);
  const [previewType, setPreviewType] = useState<KwitansiType>('lebur');
  const [refreshKey, setRefreshKey] = useState(0);

  function showList() {
    setView('list');
    setPreviewData(null);
  }

  function handleSaved() {
    showList();
    setRefreshKey((k) => k + 1);
  }

  function handleView(data: KwitansiData, type: KwitansiType) {
    setPreviewData(data);
    setPreviewType(type);
    setView('preview');
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8">
      <div className="max-w-[1040px] mx-auto surface-card relative p-5 sm:p-7 lg:p-8">
        {/* Header */}
        <div className="flex flex-wrap gap-4 justify-between items-center border-b pb-5 mb-6 no-print" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center font-bold flex-shrink-0"
              style={{
                width: 38, height: 38, borderRadius: 11,
                background: 'var(--accent)', color: 'var(--accent-contrast)',
                fontSize: 16,
              }}
            >
              K
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight" style={{ margin: 0 }}>
                Selamat datang, <span style={{ fontWeight: 700 }}>{user.name}</span>
              </h3>
              <span className="role-badge" style={{ marginTop: 2 }}>{user.role}</span>
            </div>
          </div>

          <div className="flex gap-2.5 flex-wrap items-center">
            <ThemePicker />
            {user.role === 'admin' && (
              <Button variant="secondary" size="auto" onClick={() => setView('formUser')}>
                <UserPlus size={15} /> Akun Baru
              </Button>
            )}
            <Button variant="primary" size="auto" onClick={() => setView('formKwitansi')}>
              <Plus size={15} /> Buat Kwitansi
            </Button>
            <Button variant="danger" size="auto" onClick={onLogout}>
              <LogOut size={15} /> Logout
            </Button>
          </div>
        </div>

        {/* Content */}
        {view === 'list' && (
          <ReceiptList user={user} onView={handleView} refreshKey={refreshKey} />
        )}
        {view === 'formKwitansi' && (
          <ReceiptForm onSaved={handleSaved} onCancel={showList} />
        )}
        {view === 'formUser' && (
          <UserForm onSaved={showList} onCancel={showList} />
        )}
        {view === 'preview' && previewData && (
          <ReceiptPreview data={previewData} type={previewType} onBack={showList} />
        )}
      </div>
    </div>
  );
}
