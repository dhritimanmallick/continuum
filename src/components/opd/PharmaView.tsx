import React, { useState } from 'react';
import { 
  Pill, 
  Search, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Printer, 
  Sparkles, 
  Check, 
  AlertCircle, 
  UserCheck, 
  Phone, 
  ShieldCheck, 
  Tag, 
  Package, 
  Send,
  Eye,
  Filter,
  DollarSign,
  ArrowRight,
  RefreshCw,
  QrCode,
  FileText,
  MapPin,
  Compass,
  Bike,
  Globe
} from 'lucide-react';
import { PharmacyOrder, PrescriptionMedicineItem, OpdClinic, PharmacyPartner } from '../../types';
import { opdStore, OPD_CLINICS } from '../../services/opdStore';

interface PharmaViewProps {
  onOpenWhatsAppView?: (patientId?: string) => void;
}

export const PharmaView: React.FC<PharmaViewProps> = ({ onOpenWhatsAppView }) => {
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>(opdStore.selectedPharmacyId || 'pharm-janaushadhi');
  const [selectedClinicFilter, setSelectedClinicFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'dispensed'>('all');
  const [selectedOrderForDispensing, setSelectedOrderForDispensing] = useState<PharmacyOrder | null>(null);
  const [selectedOrderForLabel, setSelectedOrderForLabel] = useState<PharmacyOrder | null>(null);
  const [pharmacistNotes, setPharmacistNotes] = useState('');
  const [batchNumber, setBatchNumber] = useState('BCH-2026-X89');
  const [isDispensing, setIsDispensing] = useState(false);
  const [dispenseSuccessToast, setDispenseSuccessToast] = useState<string | null>(null);

  const allPharmPartners = opdStore.getPharmacyPartners();
  const currentPharmacy: PharmacyPartner = allPharmPartners.find(p => p.id === selectedPharmacyId) || allPharmPartners[1] || allPharmPartners[0];

  // Fetch all orders across clinics or filtered
  const allOrders = opdStore.getAllPharmacyOrders(selectedClinicFilter === 'all' ? undefined : selectedClinicFilter);

  // Apply search and status filter
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = 
      order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.opdId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.doctorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'pending' ? order.status !== 'DISPENSED' && order.status !== 'CANCELLED' :
      order.status === 'DISPENSED';

    return matchesSearch && matchesStatus;
  });

  const pendingCount = allOrders.filter(o => o.status !== 'DISPENSED' && o.status !== 'CANCELLED').length;
  const readyCount = allOrders.filter(o => o.status === 'READY_FOR_PICKUP').length;
  const dispensedCount = allOrders.filter(o => o.status === 'DISPENSED').length;

  const handleStartDispensing = (order: PharmacyOrder) => {
    setSelectedOrderForDispensing(order);
    setPharmacistNotes('Counselled on dosage schedule. Generic equivalent verified. Stored in dry place.');
    setBatchNumber(`BCH-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleConfirmDispense = () => {
    if (!selectedOrderForDispensing) return;
    setIsDispensing(true);

    setTimeout(() => {
      opdStore.updatePharmacyOrderStatus(selectedOrderForDispensing.id, 'DISPENSED');
      setIsDispensing(false);
      const token = selectedOrderForDispensing.tokenNumber;
      setSelectedOrderForDispensing(null);
      setDispenseSuccessToast(`Token #${token} fulfilled! Medicine loop completed and patient notified via WhatsApp.`);
      setTimeout(() => setDispenseSuccessToast(null), 4000);
    }, 600);
  };

  const handleMarkReady = (orderId: string) => {
    opdStore.updatePharmacyOrderStatus(orderId, 'READY_FOR_PICKUP');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {dispenseSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-500 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <p className="text-xs font-bold">{dispenseSuccessToast}</p>
        </div>
      )}

      {/* Pharmacy Store Switcher Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-700" />
          <span className="font-extrabold text-slate-800 uppercase tracking-wide text-[11px]">
            Active Pharmacy Store / Chemist Location:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 font-bold">
          {allPharmPartners.map(pharm => (
            <button
              key={pharm.id}
              onClick={() => {
                setSelectedPharmacyId(pharm.id);
                opdStore.setSelectedPharmacy(pharm.id);
              }}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                pharm.id === currentPharmacy.id
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>{pharm.name.split('(')[0].split('—')[0].trim()}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {pharm.distance.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Header Banner - Pharmacy Store */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                {currentPharmacy.type}
              </span>
              {currentPharmacy.ondcParticipantId ? (
                <span className="text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Globe className="w-3 h-3 text-indigo-400" />
                  <span>ONDC BPP Seller Node: {currentPharmacy.ondcParticipantId}</span>
                </span>
              ) : null}
              <span className="text-xs text-slate-400">
                {currentPharmacy.distance} • Hours: {currentPharmacy.operatingHours}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {currentPharmacy.name}
            </h1>

            <p className="text-xs text-slate-400">
              Pharmacist: {currentPharmacy.pharmacistInCharge} • Location: {currentPharmacy.counterLocation} • Phone: {currentPharmacy.contact}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 shrink-0 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-center">
            <div className="px-3 py-1">
              <span className="block text-xl font-bold text-amber-300">{pendingCount}</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider">Pending</span>
            </div>
            <div className="px-3 py-1 border-x border-slate-700">
              <span className="block text-xl font-bold text-emerald-300">{readyCount}</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider">Ready</span>
            </div>
            <div className="px-3 py-1">
              <span className="block text-xl font-bold text-white">{dispensedCount}</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider">Dispensed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Linked OPDs Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
              Filter by Referring OPD Practice (Originating Doctor):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setSelectedClinicFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                selectedClinicFilter === 'all'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>All Referring Doctors</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {opdStore.getAllPharmacyOrders().length}
              </span>
            </button>

            {OPD_CLINICS.map(clinic => {
              const count = opdStore.getAllPharmacyOrders(clinic.id).length;
              return (
                <button
                  key={clinic.id}
                  onClick={() => setSelectedClinicFilter(clinic.id)}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    selectedClinicFilter === clinic.id
                      ? 'bg-emerald-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{clinic.leadDoctor} ({clinic.department.split(' ')[0]})</span>
                  {count > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Status Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search token #, patient name, doctor, OPD ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <span className="text-slate-500 font-semibold text-[11px]">Status:</span>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 font-bold text-[11px]">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
              >
                All ({allOrders.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${statusFilter === 'pending' ? 'bg-white text-amber-900 shadow-2xs' : 'text-slate-600'}`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setStatusFilter('dispensed')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${statusFilter === 'dispensed' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'}`}
              >
                Dispensed ({dispensedCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Grid / Queue */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Pill className="w-7 h-7" />
          </div>
          <h3 className="text-base font-extrabold text-slate-800">No prescriptions found for this view</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            When a doctor in any referring OPD prescribes medications and refers to this pharmacy store, the digital prescription arrives here with a unique pickup token.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredOrders.map(order => {
            const isDispensed = order.status === 'DISPENSED';
            const isReady = order.status === 'READY_FOR_PICKUP';

            return (
              <div 
                key={order.id} 
                className={`bg-white rounded-3xl border transition shadow-2xs flex flex-col justify-between overflow-hidden ${
                  isDispensed 
                    ? 'border-slate-200 bg-slate-50/50' 
                    : isReady
                    ? 'border-emerald-300 ring-2 ring-emerald-500/10'
                    : 'border-amber-200 ring-1 ring-amber-400/20'
                }`}
              >
                {/* Card Header */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-black px-2.5 py-1 bg-emerald-900 text-white rounded-xl shadow-2xs tracking-wider">
                        #{order.tokenNumber}
                      </span>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span>{order.patientName}</span>
                          <span className="text-xs text-slate-400 font-normal">({order.opdId})</span>
                        </h3>
                        <p className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>📞 {order.patientMobile}</span>
                          <span>•</span>
                          <span>Doctor: <strong className="text-slate-700">{order.doctorName}</strong></span>
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      isDispensed 
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : isReady
                        ? 'bg-blue-100 text-blue-900 border-blue-300 animate-pulse'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Originating Hospital & Fulfillment Method */}
                  {(() => {
                    const patient = opdStore.patients.find(p => p.id === order.patientId);
                    const isDelivery = Boolean(patient?.address && (currentPharmacy.type === 'Retail Partner' || order.tokenNumber.includes('9')));
                    return (
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Hospital Origin: District Hospital Hubballi</span>
                          </div>
                          <span className="text-slate-500 font-medium">Doctor: <strong className="text-slate-800">{order.doctorName}</strong></span>
                        </div>

                        {/* Fulfillment Mode Badge */}
                        <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs">
                          <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5 text-emerald-700" />
                            <span>
                              {isDelivery 
                                ? `Home Delivery → Send to: ${patient?.address || 'Vidyanagar, Hubballi'}` 
                                : `Collect at Pharmacy Counter (Token #${order.tokenNumber})`}
                            </span>
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                            {isDelivery ? 'Delivery Order' : 'Counter Pickup'}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Prescribed Medications Table */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      Prescribed Medications ({order.medicines.length} Items):
                    </span>

                    <div className="space-y-2">
                      {order.medicines.map((med, idx) => (
                        <div 
                          key={med.id || idx} 
                          className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-extrabold text-xs text-slate-900 block">
                                {med.medicineName}
                              </span>
                              <p className="text-[11px] text-teal-800 font-bold">
                                {med.dosage} • {med.frequency} • {med.timing} ({med.duration})
                              </p>
                            </div>
                            <span className="text-xs font-mono font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 shrink-0">
                              Qty: {med.quantity || 30}
                            </span>
                          </div>

                          {/* PMBJP Generic Matching Badge */}
                          {med.genericEquivalent && (
                            <div className="flex items-center gap-1.5 p-1.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[10px] text-emerald-900 font-bold">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">Store Equivalent: {med.genericEquivalent}</span>
                            </div>
                          )}

                          {med.instructions && (
                            <p className="text-[10px] text-slate-500 italic">
                              Note: {med.instructions}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dispensed Info if Completed */}
                  {isDispensed && (
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-extrabold text-emerald-950">Medication Loop Closed</p>
                          <p className="text-[11px] text-emerald-800">
                            Dispensed at {currentPharmacy.name} by {order.dispensedBy || currentPharmacy.pharmacistInCharge}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-emerald-900 px-2 py-1 rounded-lg border border-emerald-300">
                        OPD Synced ✓
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOrderForLabel(order)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>Print Pouch Label</span>
                    </button>

                    {onOpenWhatsAppView && (
                      <button
                        onClick={() => onOpenWhatsAppView(order.patientId)}
                        className="px-2.5 py-1.5 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                        title="View patient WhatsApp messages"
                      >
                        <Send className="w-3 h-3 text-emerald-600" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!isDispensed && !isReady && (
                      <button
                        onClick={() => handleMarkReady(order.id)}
                        className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-extrabold rounded-xl text-xs cursor-pointer shadow-2xs transition"
                      >
                        Mark Ready for Pickup
                      </button>
                    )}

                    {!isDispensed ? (
                      <button
                        onClick={() => handleStartDispensing(order)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition active:scale-95"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-300" />
                        <span>Dispense & Complete Loop</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Fulfilled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Dispense & Loop Closure Confirmation */}
      {selectedOrderForDispensing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Confirm Dispensing & Complete Loop
                  </h3>
                  <p className="text-xs text-slate-500">
                    Store: {currentPharmacy.name} ({currentPharmacy.distance})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrderForDispensing(null)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Origin & Patient Summary */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Referring OPD Practice:</span>
                <span className="font-bold text-slate-900">{selectedOrderForDispensing.clinicName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Prescribing Doctor:</span>
                <span className="font-bold text-slate-900">{selectedOrderForDispensing.doctorName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-900">
                  {selectedOrderForDispensing.patientName} ({selectedOrderForDispensing.patientMobile})
                </span>
              </div>
            </div>

            {/* Medicines being handed over */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide block">
                Medicines Checked & Handed Over:
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {selectedOrderForDispensing.medicines.map((m, i) => (
                  <div key={i} className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-950 block">{m.medicineName}</span>
                      <span className="text-[11px] text-teal-800">{m.dosage} • {m.frequency} ({m.duration})</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                      Qty: {m.quantity || 30}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pharmacist verification input */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Batch / Lot Number</label>
                <input
                  type="text"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Billing Scheme</label>
                <input
                  type="text"
                  readOnly
                  value={currentPharmacy.discountOffer}
                  className="w-full p-2 bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs">Pharmacist Counseling Notes</label>
              <textarea
                rows={2}
                value={pharmacistNotes}
                onChange={(e) => setPharmacistNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Closing the Referral Loop Across Stores:</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                Clicking confirm marks the prescription as <strong>FULFILLED</strong> at {currentPharmacy.name}, updates the referring doctor&apos;s chart at the distant OPD, and sends an instant WhatsApp pickup and dosage schedule reminder to the patient.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedOrderForDispensing(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDispensing}
                onClick={handleConfirmDispense}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isDispensing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Dispensing & Closing Loop...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Dispense & Complete Loop</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Printable Medication Pouch Label */}
      {selectedOrderForLabel && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase">Medication Pouch / Bag Label</span>
              <button 
                onClick={() => setSelectedOrderForLabel(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Printable Label Slip Preview */}
            <div className="border-2 border-dashed border-slate-300 p-5 rounded-2xl bg-amber-50/20 space-y-3 font-sans text-xs">
              <div className="text-center pb-2 border-b border-slate-200">
                <span className="font-extrabold text-sm text-slate-900 block uppercase">
                  {currentPharmacy.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {currentPharmacy.counterLocation} • {currentPharmacy.contact}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold">
                <span>Patient: {selectedOrderForLabel.patientName}</span>
                <span className="font-mono bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded">
                  Token #{selectedOrderForLabel.tokenNumber}
                </span>
              </div>

              <div className="text-[10px] text-slate-600 space-y-0.5">
                <p>OPD ID: {selectedOrderForLabel.opdId} • Doctor: {selectedOrderForLabel.doctorName}</p>
                <p>Origin: {selectedOrderForLabel.clinicName}</p>
                <p>Date: 10 Oct 2026 • Batch: BCH-2026-X89</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <span className="font-extrabold text-[10px] uppercase tracking-wider text-slate-700 block">
                  Prescription Directions:
                </span>
                {selectedOrderForLabel.medicines.map((m, idx) => (
                  <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 text-[11px]">
                    <span className="font-bold text-slate-900 block">{m.medicineName}</span>
                    <span className="text-teal-800 font-semibold">{m.dosage} — {m.frequency} ({m.timing})</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center text-[10px] text-slate-500 border-t border-slate-200">
                Keep medicines away from direct sunlight. Complete prescribed duration.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrderForLabel(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pouch Label</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
