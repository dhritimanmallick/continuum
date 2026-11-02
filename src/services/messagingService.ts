import { CommunicationTemplate, PatientCommunication } from '../types';

export const INITIAL_TEMPLATES: CommunicationTemplate[] = [
  {
    id: 'TMPL-EN-A7',
    title: 'Glucose Test Overdue (English)',
    careGapType: 'record_test',
    language: 'English',
    message: 'Hello {patientName}, this is {facilityName}. Our records show that your 24–28 week Glucose test (OGTT) is overdue by {overdueWeeks}. Please visit Room 12, Antenatal OPD between 9 AM and 1 PM for testing. Timely screening ensures safe pregnancy care. Contact us: {facilityContact}.',
    active: true,
    approvedBy: 'Dr. Anita Rao'
  },
  {
    id: 'TMPL-HI-A7',
    title: 'Glucose Test Overdue (Hindi)',
    careGapType: 'record_test',
    language: 'Hindi',
    message: 'नमस्ते {patientName}, यह {facilityName} से संदेश है। हमारे रिकॉर्ड के अनुसार आपका 24-28 सप्ताह का ग्लूकोज टेस्ट (OGTT) {overdueWeeks} से लंबित है। कृपया जांच के लिए सुबह 9 से दोपहर 1 बजे के बीच प्रसवपूर्व ओपीडी, कमरा 12 में आएं। संपर्क करें: {facilityContact}।',
    active: true,
    approvedBy: 'Dr. Anita Rao'
  },
  {
    id: 'TMPL-KN-A7',
    title: 'Glucose Test Overdue (Kannada)',
    careGapType: 'record_test',
    language: 'Kannada',
    message: 'ನಮಸ್ಕಾರ {patientName}, ಇದು {facilityName} ಆಸ್ಪತ್ರೆಯ ಸಂದೇಶ. ನಿಮ್ಮ 24–28 ವಾರಗಳ ಗ್ಲೂಕೋಸ್ ಪರೀಕ್ಷೆ (OGTT) {overdueWeeks} ತಡವಾಗಿದೆ. ದಯವಿಟ್ಟು ಬೆಳಿಗ್ಗೆ 9 ರಿಂದ ಮಧ್ಯಾಹ್ನ 1 ರವರೆಗೆ ಕೊಠಡಿ 12 ರ ಗರ್ಭಿಣಿ ಒಪಿಡಿಗೆ ಭೇಟಿ ನೀಡಿ. ಸಂಪರ್ಕಿಸಿ: {facilityContact}.',
    active: true,
    approvedBy: 'Dr. Anita Rao'
  },
  {
    id: 'TMPL-TA-A7',
    title: 'Glucose Test Overdue (Tamil)',
    careGapType: 'record_test',
    language: 'Tamil',
    message: 'வணக்கம் {patientName}, இது {facilityName}. உங்கள் 24–28 வார குளுக்கோஸ் பரிசோதனை (OGTT) {overdueWeeks} நிலுவையில் உள்ளது. தயவுசெய்து காலை 9 முதல் மதியம் 1 மணி வரை அறை 12, மகப்பேறு வெளிநோயாளர் பிரிவுக்கு வரவும். தொடர்பு: {facilityContact}.',
    active: true,
    approvedBy: 'Dr. Anita Rao'
  },
  {
    id: 'TMPL-MR-A7',
    title: 'Glucose Test Overdue (Marathi)',
    careGapType: 'record_test',
    language: 'Marathi',
    message: 'नमस्कार {patientName}, हे {facilityName} कडून संदेश आहे. आपल्या नोंदीनुसार आपली 24–28 आठवड्यांची ग्लुकोज तपासणी (OGTT) {overdueWeeks} थकीत आहे. कृपया सकाळी 9 ते दुपारी 1 दरम्यान ओपीडी कक्ष 12 ला भेट द्या. संपर्क: {facilityContact}।',
    active: true,
    approvedBy: 'Dr. Anita Rao'
  },
  {
    id: 'TMPL-EN-SCAN',
    title: 'Ultrasound Scan Due/Overdue (English)',
    careGapType: 'record_scan',
    language: 'English',
    message: 'Hello {patientName}, this is {facilityName}. Your scheduled {scanName} is {statusText} ({overdueWeeks}). Please visit the Ultrasound Department for your scan. Bringing your previous MCP card and ultrasound slips is requested. Helpdesk: {facilityContact}.',
    active: true,
    approvedBy: 'Dr. Anita Rao'
  },
  {
    id: 'TMPL-EN-IMMUN',
    title: 'Child Immunisation Overdue (English)',
    careGapType: 'record_immunisation',
    language: 'English',
    message: 'Hello {patientName}, this is {facilityName}. Our records show that immunisation dose for {childName} is overdue by {overdueWeeks}. Please visit the Child Health & Immunisation Room (Room 4) on Tuesday or Friday between 9 AM and 1 PM. Contact: {facilityContact}.',
    active: true,
    approvedBy: 'Dr. Suresh Kumar'
  },
  {
    id: 'TMPL-KN-IMMUN',
    title: 'Child Immunisation Overdue (Kannada)',
    careGapType: 'record_immunisation',
    language: 'Kannada',
    message: 'ನಮಸ್ಕಾರ {patientName}, ಇದು {facilityName} ಆಸ್ಪತ್ರೆಯ ಸಂದೇಶ. {childName} ರವರ ಲಸಿಕೆ {overdueWeeks} ತಡವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮಂಗಳವಾರ ಅಥವಾ ಶುಕ್ರವಾರ ಬೆಳಿಗ್ಗೆ 9 ರಿಂದ ಮಧ್ಯಾಹ್ನ 1 ರವರೆಗೆ ಕೊಠಡಿ 4 ರಲ್ಲಿರುವ ಮಕ್ಕಳ ಲಸಿಕಾ ಕೇಂದ್ರಕ್ಕೆ ಕರೆತನ್ನಿ. ಸಂಪರ್ಕಿಸಿ: {facilityContact}.',
    active: true,
    approvedBy: 'Dr. Suresh Kumar'
  },
  {
    id: 'TMPL-EN-VISIT',
    title: 'Antenatal / Postnatal Visit Checkup (English)',
    careGapType: 'record_visit',
    language: 'English',
    message: 'Hello {patientName}, this is {facilityName}. Your routine antenatal health check is due. Please visit the Maternal Health OPD for blood pressure check, IFA replenishment, and maternal checkup. Timings: 9 AM - 1 PM.',
    active: true,
    approvedBy: 'Dr. Anita Rao'
  }
];

export interface IMessagingService {
  dispatchMessage(params: {
    careGapId: string;
    patientId: string;
    patientName: string;
    mobile: string;
    channel: 'whatsapp' | 'sms';
    templateId: string;
    language: string;
    messageBody: string;
    staffUserId: string;
    staffUserName: string;
  }): Promise<PatientCommunication>;
}

export class MockMessagingService implements IMessagingService {
  async dispatchMessage(params: {
    careGapId: string;
    patientId: string;
    patientName: string;
    mobile: string;
    channel: 'whatsapp' | 'sms';
    templateId: string;
    language: string;
    messageBody: string;
    staffUserId: string;
    staffUserName: string;
  }): Promise<PatientCommunication> {
    const timestamp = new Date().toISOString();
    return {
      id: `MSG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      careGapId: params.careGapId,
      patientId: params.patientId,
      patientName: params.patientName,
      mobile: params.mobile,
      channel: params.channel,
      templateId: params.templateId,
      language: params.language,
      messageBody: params.messageBody,
      sentAt: timestamp,
      deliveryStatus: 'DELIVERED',
      staffUserId: params.staffUserId,
      staffUserName: params.staffUserName
    };
  }
}

export const messagingService: IMessagingService = new MockMessagingService();
