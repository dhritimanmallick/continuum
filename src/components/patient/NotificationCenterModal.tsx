import React, { useState } from 'react';
import { 
  Bell, 
  MessageSquare, 
  Smartphone, 
  Check, 
  CheckCheck, 
  Clock, 
  Filter, 
  X,
  Settings,
  ShieldCheck,
  Send,
  AlertCircle
} from 'lucide-react';
import { UnifiedNotificationItem, NotificationPreference, NotificationCategory, NotificationChannel, OpdPatient } from '../../types';
import { unifiedNotificationService } from '../../services/unifiedNotificationService';
import { opdStore } from '../../services/opdStore';

interface NotificationCenterModalProps {
  initialPatientId?: string;
  onClose: () => void;
  onOpenWhatsAppView?: () => void;
}

const CATEGORY_NAMES: Record<NotificationCategory, string> = {
  APPOINTMENT: 'Consultation & Appointments',
  LAB_REPORT: 'Pathology & Diagnostic Reports',
  LABOUR_UPDATE: 'Labour & Delivery Updates',
  PAYMENT_BILLING: 'Invoices & Quotations',
  MEDICINE_REMINDER: 'Prescription & Medication Reminders',
  CLINICAL_ALERT: 'High-Priority Clinical Alerts'
};

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  initialPatientId,
  onClose,
  onOpenWhatsAppView
}) => {
  const [, setVersion] = useState(0);
  const patient = opdStore.patients.find(p => p.id === (initialPatientId || 'PAT-104')) || opdStore.patients[0];

  const [activeTab, setActiveTab] = useState<'INBOX' | 'PREFERENCES'>('INBOX');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const notifications = unifiedNotificationService.getNotificationsForPatient(patient.id);
  const preferences = unifiedNotificationService.getPreferences(patient.id);

  const filteredNotifs = notifications.filter(n => {
    if (selectedFilter === 'ALL') return true;
    return n.category === selectedFilter;
  });

  const handleToggleChannelPref = (cat: NotificationCategory, channel: 'whatsapp' | 'sms' | 'push') => {
    const catPrefs = { ...preferences.categories[cat] };
    catPrefs[channel] = !catPrefs[channel];
    unifiedNotificationService.updatePreferences(patient.id, {
      categories: {
        ...preferences.categories,
        [cat]: catPrefs
      }
    });
    setVersion(v => v + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#faf8f6] rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-xs">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-indigo-900/60 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center font-bold text-indigo-300 text-base shadow-xs">
              <Bell className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">UNIFIED NOTIFICATION &amp; COMMUNICATION CENTRE</h3>
                <span className="text-[10px] bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded-full font-bold">
                  Multichannel Hub
                </span>
              </div>
              <p className="text-[11px] text-indigo-200 font-medium">
                Unified messaging history across WhatsApp Business API, SMS, Push, and patient channel preferences.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab & Channel summary */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl font-bold">
            <button
              onClick={() => setActiveTab('INBOX')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                activeTab === 'INBOX' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Message Inbox ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('PREFERENCES')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'PREFERENCES' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Channel Preferences</span>
            </button>
          </div>

          {onOpenWhatsAppView && (
            <button
              onClick={onOpenWhatsAppView}
              className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Open Live WhatsApp Terminal</span>
            </button>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: INBOX */}
          {activeTab === 'INBOX' && (
            <div className="space-y-4">
              
              {/* Category filter pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { key: 'ALL', label: 'All Messages' },
                  { key: 'LABOUR_UPDATE', label: 'Labour Updates' },
                  { key: 'LAB_REPORT', label: 'Lab Reports' },
                  { key: 'PAYMENT_BILLING', label: 'Billing & Quotes' },
                  { key: 'MEDICINE_REMINDER', label: 'Medication Reminders' }
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setSelectedFilter(f.key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition cursor-pointer ${
                      selectedFilter === f.key 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Notification Items */}
              <div className="space-y-3">
                {filteredNotifs.map(notif => (
                  <div
                    key={notif.id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2 hover:border-slate-300 transition"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          notif.category === 'LABOUR_UPDATE' ? 'bg-rose-500' : notif.category === 'LAB_REPORT' ? 'bg-purple-500' : 'bg-emerald-500'
                        }`} />
                        <h4 className="font-black text-xs text-slate-900">{notif.title}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">{notif.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      {notif.body}
                    </p>

                    {/* Delivery receipts & channels */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                      <div className="flex items-center gap-2">
                        <span>Delivered to: <strong>{notif.recipientMobile}</strong></span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {notif.channels.map(ch => (
                            <span key={ch} className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-bold uppercase">
                              {ch}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-emerald-700 font-bold">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{notif.deliveryReceipts[0]?.status || 'Delivered'}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredNotifs.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500">
                    No notifications in this category.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CHANNEL PREFERENCES */}
          {activeTab === 'PREFERENCES' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-5">
              <div>
                <h4 className="font-black text-slate-900 text-sm">Patient Channel Delivery Preferences</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose which communication channels (WhatsApp, SMS, or Mobile Push) {patient.name} receives for each type of hospital event.
                </p>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-12 bg-slate-50 p-3 text-[11px] font-bold text-slate-600">
                  <div className="col-span-6">Notification Category</div>
                  <div className="col-span-2 text-center">WhatsApp</div>
                  <div className="col-span-2 text-center">SMS</div>
                  <div className="col-span-2 text-center">Push App</div>
                </div>

                {(Object.keys(CATEGORY_NAMES) as NotificationCategory[]).map(catKey => {
                  const catPref = preferences.categories[catKey] || { whatsapp: true, sms: true, push: true };
                  return (
                    <div key={catKey} className="grid grid-cols-12 p-3.5 items-center hover:bg-slate-50/50 text-xs">
                      <div className="col-span-6">
                        <span className="font-bold text-slate-900 block">{CATEGORY_NAMES[catKey]}</span>
                        <span className="text-[10px] text-slate-400">Automated hospital triggers</span>
                      </div>

                      <div className="col-span-2 flex justify-center">
                        <input
                          type="checkbox"
                          checked={catPref.whatsapp}
                          onChange={() => handleToggleChannelPref(catKey, 'whatsapp')}
                          className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                        />
                      </div>

                      <div className="col-span-2 flex justify-center">
                        <input
                          type="checkbox"
                          checked={catPref.sms}
                          onChange={() => handleToggleChannelPref(catKey, 'sms')}
                          className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                        />
                      </div>

                      <div className="col-span-2 flex justify-center">
                        <input
                          type="checkbox"
                          checked={catPref.push}
                          onChange={() => handleToggleChannelPref(catKey, 'push')}
                          className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Preferences automatically synchronized with ABDM Consent Gateway and Hospital Messaging Bus.</span>
                <span className="text-emerald-700 font-bold">✓ Synced</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
