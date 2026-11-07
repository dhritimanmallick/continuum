/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { OpdNavbar } from './components/opd/OpdNavbar';
import { ReceptionView } from './components/opd/ReceptionView';
import { DoctorView } from './components/opd/DoctorView';
import { LabView } from './components/opd/LabView';
import { PharmaView } from './components/opd/PharmaView';
import { AdminPortalView } from './components/admin/AdminPortalView';
import { LoginView } from './components/auth/LoginView';
import { NewPatientModal } from './components/opd/NewPatientModal';
import { WhatsAppJourneyModal } from './components/opd/WhatsAppJourneyModal';
import { PatientBasicProfileModal } from './components/opd/PatientBasicProfileModal';
import { MyCareJourneyModal } from './components/opd/MyCareJourneyModal';
import { VicinityRadarView } from './components/vicinity/VicinityRadarView';
import { DoctorRevenueDashboard } from './components/vicinity/DoctorRevenueDashboard';
import { PatientUnifiedDashboardModal } from './components/patient/PatientUnifiedDashboardModal';
import { PatientPortalView } from './components/patient/PatientPortalView';
import { KnowledgeLibraryModal } from './components/patient/KnowledgeLibraryModal';
import { TreatmentCostEstimatorModal } from './components/patient/TreatmentCostEstimatorModal';
import { EmergencyDoctorCounsellingModal } from './components/patient/EmergencyDoctorCounsellingModal';
import { LabourDeliveryLiveTrackerModal } from './components/patient/LabourDeliveryLiveTrackerModal';
import { NotificationCenterModal } from './components/patient/NotificationCenterModal';
import { SystemVideoTourModal } from './components/video/SystemVideoTourModal';
import { opdStore } from './services/opdStore';
import { authService } from './services/authService';
import { OpdUserRole, OpdPatient, PortalType, OpdRole, AuthUser } from './types';

export default function App() {

  const [, setVersion] = useState(0);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(authService.getCurrentUser());

  // Subscribe to reactive store and auth changes
  useEffect(() => {
    const unsubStore = opdStore.subscribe(() => {
      setVersion(v => v + 1);
      setCurrentPortal(opdStore.currentPortal);
      setCurrentRole(opdStore.currentRole);
    });
    const unsubAuth = authService.subscribe(() => {
      setCurrentUser(authService.getCurrentUser());
      setVersion(v => v + 1);
    });
    return () => {
      unsubStore();
      unsubAuth();
    };
  }, []);

  const [currentPortal, setCurrentPortal] = useState<PortalType>(
    authService.getCurrentUser()?.role === 'ADMIN' ? 'ADMIN' : opdStore.currentPortal
  );
  const [currentRole, setCurrentRole] = useState<OpdUserRole>(
    authService.getCurrentUser()?.role || opdStore.currentRole
  );
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [whatsAppModalPatientId, setWhatsAppModalPatientId] = useState<string | null>(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [selectedPatientForProfile, setSelectedPatientForProfile] = useState<OpdPatient | null>(null);
  const [showCareJourneyModal, setShowCareJourneyModal] = useState(false);
  const [careJourneyPatientId, setCareJourneyPatientId] = useState<string | null>(null);

  // New Comprehensive Patient & Hospital Modules
  const [showPatientHubModal, setShowPatientHubModal] = useState(false);
  const [patientHubInitialTab, setPatientHubInitialTab] = useState<'FAMILY' | 'LIBRARY' | 'AI_COUNSELLOR' | 'COSTS' | 'COUNSELLING' | 'LABOUR' | 'NOTIFICATIONS'>('FAMILY');
  const [showKnowledgeLibraryModal, setShowKnowledgeLibraryModal] = useState(false);
  const [showCostEstimatorModal, setShowCostEstimatorModal] = useState(false);
  const [showEmergencyCounsellingModal, setShowEmergencyCounsellingModal] = useState(false);
  const [showLabourTrackerModal, setShowLabourTrackerModal] = useState(false);
  const [showNotificationCenterModal, setShowNotificationCenterModal] = useState(false);
  const [showVideoTourModal, setShowVideoTourModal] = useState(false);

  const stats = opdStore.getStats();

  const handlePortalChange = (portal: PortalType) => {
    setCurrentPortal(portal);
    opdStore.setPortal(portal);
    setCurrentRole(opdStore.currentRole);
  };

  const handleOpdRoleChange = (role: OpdRole) => {
    setCurrentRole(role);
    opdStore.setOpdRole(role);
  };

  const handleOpenWhatsAppView = (patientId?: string) => {
    setWhatsAppModalPatientId(patientId || opdStore.patients[0]?.id || null);
    setShowWhatsAppModal(true);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.role === 'ADMIN') {
      handlePortalChange('ADMIN');
    } else if (user.role === 'DOCTOR') {
      if (user.doctorId) {
        opdStore.setDoctorProfile(user.doctorId);
      }
      handlePortalChange('OPD');
      handleOpdRoleChange('DOCTOR');
    } else if (user.role === 'RECEPTION') {
      handlePortalChange('OPD');
      handleOpdRoleChange('RECEPTION');
    } else if (user.role === 'LAB') {
      if (user.vendorPartnerId) {
        opdStore.setSelectedLab(user.vendorPartnerId);
      }
      handlePortalChange('LAB');
    } else if (user.role === 'PHARMA') {
      if (user.vendorPartnerId) {
        opdStore.setSelectedPharmacy(user.vendorPartnerId);
      }
      handlePortalChange('PHARMA');
    }
  };

  // If no user is logged in, show the Login and Staff Authentication View
  if (!currentUser) {
    return (
      <>
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          onOpenVideoTour={() => setShowVideoTourModal(true)}
        />
        {showVideoTourModal && (
          <SystemVideoTourModal
            isOpen={showVideoTourModal}
            onClose={() => setShowVideoTourModal(false)}
            onLaunchUser={(user) => {
              authService.quickLogin(user.id);
              handleLoginSuccess(user);
              setShowVideoTourModal(false);
            }}
          />
        )}
      </>
    );
  }

  // INDIVIDUAL LOGIN LEVEL: Patient & Family Portal View
  if (currentUser.role === 'PATIENT') {
    return (
      <>
        <PatientPortalView
          currentUser={currentUser}
          patientId={currentUser.patientId || 'PAT-104'}
          onLogout={() => {
            authService.logout();
            setCurrentUser(null);
          }}
          onOpenVideoTour={() => setShowVideoTourModal(true)}
        />
        {showVideoTourModal && (
          <SystemVideoTourModal
            isOpen={showVideoTourModal}
            onClose={() => setShowVideoTourModal(false)}
            onLaunchUser={(user) => {
              authService.quickLogin(user.id);
              handleLoginSuccess(user);
              setShowVideoTourModal(false);
            }}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f5] flex flex-col font-sans text-slate-900 selection:bg-rose-200">
      {/* Top Navbar with Portals: Admin, OPD Clinics, Diagnostic Labs, Pharmacies */}
      <OpdNavbar
        currentPortal={currentPortal}
        currentRole={currentRole}
        onPortalChange={handlePortalChange}
        onOpdRoleChange={handleOpdRoleChange}
        stats={stats}
        onOpenWhatsAppView={() => handleOpenWhatsAppView()}
        onOpenCareJourney={() => {
          setCareJourneyPatientId(null);
          setShowCareJourneyModal(true);
        }}
        onOpenPatientHub={() => {
          setPatientHubInitialTab('FAMILY');
          setShowPatientHubModal(true);
        }}
        onOpenKnowledgeLibrary={() => {
          setShowKnowledgeLibraryModal(true);
        }}
        onOpenCostEstimator={() => {
          setShowCostEstimatorModal(true);
        }}
        onOpenDoctorCounselling={() => {
          setShowEmergencyCounsellingModal(true);
        }}
        onOpenLabourTracker={() => {
          setShowLabourTrackerModal(true);
        }}
        onOpenNotifications={() => {
          setShowNotificationCenterModal(true);
        }}
        onOpenVideoTour={() => {
          setShowVideoTourModal(true);
        }}
        onLogout={() => {
          authService.logout();
          setCurrentUser(null);
        }}
      />

      {/* Main Workspace based on the active Portal */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* PORTAL 0: Hospital / Nursing Home Administration */}
        {currentPortal === 'ADMIN' && (
          <AdminPortalView
            onNavigateToPortal={(portal, role) => {
              handlePortalChange(portal);
              if (role) handleOpdRoleChange(role);
            }}
            onOpenWhatsAppView={handleOpenWhatsAppView}
          />
        )}

        {/* PORTAL 1: OPD Reception */}
        {currentPortal === 'OPD' && currentRole === 'RECEPTION' && (
          <ReceptionView
            onOpenNewPatientModal={() => setShowNewPatientModal(true)}
            onOpenWhatsAppView={handleOpenWhatsAppView}
            onSelectPatient={(p) => setSelectedPatientForProfile(p)}
          />
        )}

        {/* PORTAL 1: OPD Doctor Suite */}
        {currentPortal === 'OPD' && currentRole === 'DOCTOR' && (
          <DoctorView
            onOpenWhatsAppView={handleOpenWhatsAppView}
          />
        )}

        {/* PORTAL 2: Pathology & Diagnostic Labs */}
        {currentPortal === 'LAB' && (
          <LabView 
            onOpenWhatsAppView={handleOpenWhatsAppView}
          />
        )}

        {/* PORTAL 3: Pharmacies & PM Jan Aushadhi */}
        {currentPortal === 'PHARMA' && (
          <PharmaView 
            onOpenWhatsAppView={handleOpenWhatsAppView}
          />
        )}

        {/* PORTAL 4: Vicinity Radar & Neighborhood Order Intake */}
        {currentPortal === 'VICINITY' && (
          <VicinityRadarView
            onNavigateToPortal={(portal, role) => {
              handlePortalChange(portal);
              if (role) handleOpdRoleChange(role);
            }}
            onOpenWhatsAppView={handleOpenWhatsAppView}
          />
        )}

        {/* PORTAL 5: Doctor Revenue Attribution & Impact Ledger */}
        {currentPortal === 'REVENUES' && (
          <DoctorRevenueDashboard
            onNavigateToConsultation={() => {
              handlePortalChange('OPD');
              handleOpdRoleChange('DOCTOR');
            }}
          />
        )}
      </main>

      {/* MODAL 1: New Patient 3-Step Registration */}
      {showNewPatientModal && (
        <NewPatientModal
          onClose={() => setShowNewPatientModal(false)}
          onPatientEnrolled={() => {
            setShowNewPatientModal(false);
          }}
        />
      )}

      {/* MODAL 2: WhatsApp Live Patient Journey View */}
      {showWhatsAppModal && (
        <WhatsAppJourneyModal
          initialPatientId={whatsAppModalPatientId || undefined}
          onClose={() => setShowWhatsAppModal(false)}
        />
      )}

      {/* MODAL 3: Patient Basic Profile & 10-Second Gist */}
      {selectedPatientForProfile && (
        <PatientBasicProfileModal
          patient={selectedPatientForProfile}
          onClose={() => setSelectedPatientForProfile(null)}
          onOpenWhatsApp={() => {
            handleOpenWhatsAppView(selectedPatientForProfile.id);
          }}
        />
      )}

      {/* MODAL 4: My Care Journey Patient Dashboard (All OPD Pathways) */}
      {showCareJourneyModal && (
        <MyCareJourneyModal
          initialPatientId={careJourneyPatientId || undefined}
          onClose={() => setShowCareJourneyModal(false)}
        />
      )}

      {/* MODAL 5: Patient & Family Portal Hub (Master Module) */}
      {showPatientHubModal && (
        <PatientUnifiedDashboardModal
          initialTab={patientHubInitialTab}
          onClose={() => setShowPatientHubModal(false)}
          onOpenWhatsAppView={handleOpenWhatsAppView}
          onOpenCareJourney={(pId) => {
            setCareJourneyPatientId(pId || null);
            setShowCareJourneyModal(true);
          }}
        />
      )}

      {/* MODAL 6: Digital Knowledge Library & Clinical Guides */}
      {showKnowledgeLibraryModal && (
        <KnowledgeLibraryModal
          onClose={() => setShowKnowledgeLibraryModal(false)}
          onOpenDoctorCounselling={() => {
            setShowKnowledgeLibraryModal(false);
            setShowEmergencyCounsellingModal(true);
          }}
        />
      )}

      {/* MODAL 7: Estimated Treatment Costs & WhatsApp Quotes */}
      {showCostEstimatorModal && (
        <TreatmentCostEstimatorModal
          onClose={() => setShowCostEstimatorModal(false)}
        />
      )}

      {/* MODAL 8: Rapid-Access Emergency Doctor Tele-Counselling */}
      {showEmergencyCounsellingModal && (
        <EmergencyDoctorCounsellingModal
          onClose={() => setShowEmergencyCounsellingModal(false)}
        />
      )}

      {/* MODAL 9: Labour & Delivery Updates for Consented Family */}
      {showLabourTrackerModal && (
        <LabourDeliveryLiveTrackerModal
          onClose={() => setShowLabourTrackerModal(false)}
        />
      )}

      {/* MODAL 10: Unified Notifications & Messaging Hub */}
      {showNotificationCenterModal && (
        <NotificationCenterModal
          onClose={() => setShowNotificationCenterModal(false)}
          onOpenWhatsAppView={() => handleOpenWhatsAppView()}
        />
      )}

      {/* MODAL 11: System Video Tour & 8-Persona Walkthrough */}
      {showVideoTourModal && (
        <SystemVideoTourModal
          isOpen={showVideoTourModal}
          onClose={() => setShowVideoTourModal(false)}
          onLaunchUser={(user) => {
            authService.quickLogin(user.id);
            handleLoginSuccess(user);
            setShowVideoTourModal(false);
          }}
        />
      )}
    </div>
  );
}

