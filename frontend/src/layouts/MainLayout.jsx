import { useState } from 'react';
import { Briefcase, Database, Zap, UploadCloud, Edit3, Mail } from 'lucide-react';
import Modal from '../components/common/Modal';
import UploadModal from '../components/applications/UploadModal';
import ManualAddModal from '../components/applications/ManualAddModal';
import ColdEmailModal from '../components/coldEmails/ColdEmailModal';

export default function MainLayout({ children }) {
  const [modalType, setModalType] = useState(null); // 'upload', 'manual', 'email', null

  return (
    <div className="min-h-screen bg-gray-50/30 font-sans text-gray-900">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">

          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 tracking-tight">AI Job Tracker</h1>
              <p className="text-[10px] text-gray-500 font-medium flex items-center space-x-1">
                <Zap className="w-3 h-3 text-amber-500" />
                <span>Workspace of Sourabh</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setModalType('email')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 transition-colors"
              title="Log Cold Email"
            >
              <Mail className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Log Cold Email</span>
            </button>

            <button
              onClick={() => setModalType('manual')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition-colors"
              title="Add Manually"
            >
              <Edit3 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Add Manually</span>
            </button>

            <button
              onClick={() => setModalType('upload')}
              className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all active:scale-95"
              title="Upload Screenshots"
            >
              <UploadCloud className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Screenshots</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-6 text-center text-xs text-gray-500">
        <div className="flex items-center justify-center space-x-4 mb-2">
          <div className="flex items-center space-x-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">Live & Running</span>
          </div>
        </div>
        AI Job Tracker  •  Built for productivity • Sourabh
      </footer>

      {/* Modals */}
      <Modal isOpen={modalType === 'upload'} onClose={() => setModalType(null)} title="Upload Job Screenshots">
        <UploadModal onClose={() => setModalType(null)} />
      </Modal>

      <Modal isOpen={modalType === 'manual'} onClose={() => setModalType(null)} title="Add Application Manually">
        <ManualAddModal onClose={() => setModalType(null)} />
      </Modal>

      <Modal isOpen={modalType === 'email'} onClose={() => setModalType(null)} title="Cold Email Tracker">
        <ColdEmailModal onClose={() => setModalType(null)} />
      </Modal>
    </div>
  );
}
