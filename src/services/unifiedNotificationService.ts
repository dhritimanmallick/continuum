import { 
  UnifiedNotificationItem, 
  NotificationPreference, 
  NotificationCategory, 
  NotificationChannel 
} from '../types';

class UnifiedNotificationService {
  private notifications: UnifiedNotificationItem[] = [
    {
      id: 'notif-1',
      patientId: 'PAT-104',
      patientName: 'Sunita Das',
      recipientMobile: '+91 98451 12340',
      category: 'LABOUR_UPDATE',
      channels: ['WHATSAPP', 'IN_APP'],
      title: 'Labour Stage Update: Shifted to Labour Room',
      body: 'Sunita Das has been shifted into the sterile Labour & Delivery Room at District Hospital. Continuous fetal monitoring is active.',
      timestamp: 'Today at 10:15 AM',
      status: 'DELIVERED',
      deliveryReceipts: [
        { channel: 'WHATSAPP', status: 'Delivered (Read by Rajesh Das)', timestamp: '10:16 AM' },
        { channel: 'IN_APP', status: 'Displayed', timestamp: '10:15 AM' }
      ]
    },
    {
      id: 'notif-2',
      patientId: 'PAT-104',
      patientName: 'Sunita Das',
      recipientMobile: '+91 98451 12340',
      category: 'LAB_REPORT',
      channels: ['WHATSAPP', 'SMS'],
      title: 'Lab Report Released & Verified: Complete Blood Count',
      body: 'Your CBC report is ready. Hb: 10.2 g/dL. Dr. Anita Rao has reviewed and noted mild nutritional iron deficiency.',
      timestamp: 'Yesterday at 04:30 PM',
      status: 'READ',
      deliveryReceipts: [
        { channel: 'WHATSAPP', status: 'Read', timestamp: '04:35 PM' },
        { channel: 'SMS', status: 'Delivered', timestamp: '04:31 PM' }
      ]
    },
    {
      id: 'notif-3',
      patientId: 'PAT-104',
      patientName: 'Sunita Das',
      recipientMobile: '+91 98451 12340',
      category: 'PAYMENT_BILLING',
      channels: ['WHATSAPP'],
      title: 'Estimated Treatment Quotation: EST-DH-2026-8812',
      body: 'Your Normal Delivery Care Package estimate (₹22,000) is ready. View itemized breakdown or raise billing queries.',
      timestamp: '21 Oct, 11:30 AM',
      status: 'DELIVERED',
      deliveryReceipts: [
        { channel: 'WHATSAPP', status: 'Delivered', timestamp: '11:31 AM' }
      ]
    },
    {
      id: 'notif-4',
      patientId: 'PAT-104',
      patientName: 'Sunita Das',
      recipientMobile: '+91 98451 12340',
      category: 'MEDICINE_REMINDER',
      channels: ['WHATSAPP', 'PUSH'],
      title: 'Medicine Reminder: Evening Iron & Calcium Schedule',
      body: 'Reminder to take Tab. Autrin (Iron) with citrus water. Ensure at least 2 hours separation from dinner/calcium.',
      timestamp: '20 Oct, 08:00 PM',
      status: 'DELIVERED',
      deliveryReceipts: [
        { channel: 'WHATSAPP', status: 'Delivered', timestamp: '08:00 PM' }
      ]
    }
  ];

  private preferences: Record<string, NotificationPreference> = {
    'PAT-104': {
      patientId: 'PAT-104',
      whatsappEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      categories: {
        APPOINTMENT: { whatsapp: true, sms: true, push: true },
        LAB_REPORT: { whatsapp: true, sms: true, push: true },
        LABOUR_UPDATE: { whatsapp: true, sms: true, push: true },
        PAYMENT_BILLING: { whatsapp: true, sms: false, push: true },
        MEDICINE_REMINDER: { whatsapp: true, sms: false, push: true },
        CLINICAL_ALERT: { whatsapp: true, sms: true, push: true }
      }
    }
  };

  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  getNotificationsForPatient(patientId: string): UnifiedNotificationItem[] {
    return this.notifications.filter(n => n.patientId === patientId);
  }

  getAllNotifications(): UnifiedNotificationItem[] {
    return this.notifications;
  }

  getPreferences(patientId: string): NotificationPreference {
    if (!this.preferences[patientId]) {
      this.preferences[patientId] = {
        patientId,
        whatsappEnabled: true,
        smsEnabled: true,
        pushEnabled: true,
        categories: {
          APPOINTMENT: { whatsapp: true, sms: true, push: true },
          LAB_REPORT: { whatsapp: true, sms: true, push: true },
          LABOUR_UPDATE: { whatsapp: true, sms: true, push: true },
          PAYMENT_BILLING: { whatsapp: true, sms: false, push: true },
          MEDICINE_REMINDER: { whatsapp: true, sms: false, push: true },
          CLINICAL_ALERT: { whatsapp: true, sms: true, push: true }
        }
      };
    }
    return this.preferences[patientId];
  }

  updatePreferences(patientId: string, updates: Partial<NotificationPreference>): NotificationPreference {
    const current = this.getPreferences(patientId);
    this.preferences[patientId] = { ...current, ...updates };
    this.notify();
    return this.preferences[patientId];
  }

  sendNotification(params: {
    patientId: string;
    patientName: string;
    recipientMobile: string;
    category: NotificationCategory;
    title: string;
    body: string;
    actionUrl?: string;
  }): UnifiedNotificationItem {
    const prefs = this.getPreferences(params.patientId);
    const catPrefs = prefs.categories[params.category] || { whatsapp: true, sms: true, push: true };

    const channels: NotificationChannel[] = ['IN_APP'];
    if (prefs.whatsappEnabled && catPrefs.whatsapp) channels.push('WHATSAPP');
    if (prefs.smsEnabled && catPrefs.sms) channels.push('SMS');
    if (prefs.pushEnabled && catPrefs.push) channels.push('PUSH');

    const newNotif: UnifiedNotificationItem = {
      id: `notif-${Date.now()}`,
      patientId: params.patientId,
      patientName: params.patientName,
      recipientMobile: params.recipientMobile,
      category: params.category,
      channels,
      title: params.title,
      body: params.body,
      timestamp: 'Just now',
      status: 'DELIVERED',
      deliveryReceipts: channels.map(ch => ({
        channel: ch,
        status: ch === 'WHATSAPP' ? 'Delivered (WhatsApp Business API)' : 'Delivered',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      })),
      actionUrl: params.actionUrl
    };

    this.notifications.unshift(newNotif);
    this.notify();
    return newNotif;
  }
}

export const unifiedNotificationService = new UnifiedNotificationService();
