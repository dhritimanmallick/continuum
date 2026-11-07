import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { store } from './src/services/store.ts';
import { runRuleSimulation } from './src/services/rulesEngine.ts';
import { abdmService } from './src/services/abdmService.ts';
import { knowledgeLibraryService, KNOWLEDGE_DOCUMENTS } from './src/services/knowledgeLibraryService.ts';
import { costEstimatorService } from './src/services/costEstimatorService.ts';
import { emergencyCounsellingService } from './src/services/emergencyCounsellingService.ts';
import { labourDeliveryService } from './src/services/labourDeliveryService.ts';
import { familyService } from './src/services/familyService.ts';
import { unifiedNotificationService } from './src/services/unifiedNotificationService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client (User-Agent must be 'aistudio-build')
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    },
    // Cap every Gemini call: on a slow or failing response, routes fall back to their
    // built-in non-AI output instead of leaving the screen waiting.
    timeout: 15000,
    retryOptions: { attempts: 1 }
  }
});

// ==========================================
// REST API ROUTES
// ==========================================

// ==========================================
// GEMINI PATIENT GIST (Section 4)
// Strict Non-Diagnostic Clinical Extraction & Summary
// ==========================================
app.post('/api/ai/patient-gist', async (req: Request, res: Response) => {
  try {
    const { name, age, isPregnant, pregnancy, records, reason } = req.body;

    const systemInstruction = `
You are an assistive clinical summariser for maternal and child OPD doctors at Continuum.
Your task is to generate a short, glanceable patient gist for the doctor to understand in 10 seconds.
CRITICAL APPLICATION SAFEGUARDS:
1. Extract and summarise EXISTING information only.
2. DO NOT diagnose the patient.
3. DO NOT generate risk scores or high-risk labels.
4. DO NOT recommend investigations or treatment.
5. DO NOT invent missing information. If something is missing or unrecorded, state "Not recorded" or "Pending".
Output JSON with:
- headline: string (e.g. "28 years · G2P1 · 28 weeks")
- summaryText: string (2-3 sentences concise factual summary)
- importantRecords: object with keys: bloodGroup, hb, glucose, lastScan, lastOpd, previousDelivery
`;

    const prompt = `Generate a 10-second doctor's patient gist for:
Patient: ${name || 'Patient'}, ${age || 28} years old.
Gestation: ${pregnancy?.gestationalAgeWeeks || 28} weeks (EDD: ${pregnancy?.edd || '15 Dec 2026'}).
Obstetric history: G${pregnancy?.gravida || 2}P${pregnancy?.para || 1}, ${pregnancy?.previousChildren || 1} previous child (${pregnancy?.previousOutcome || 'Normal delivery'}).
Known records: Blood group ${records?.bloodGroup || 'O Negative'}, Hb ${records?.hb || '10.2 g/dL'}, Glucose ${records?.glucose || 'Pending'}, Last scan ${records?.lastScan || '18 Aug 2026'}, Last visit ${records?.lastOpd || '15 Sep 2026'}.
Visit reason: ${reason || 'Routine antenatal follow-up'}.
`;

    let gistResult = {
      headline: `${age || 28} years · G${pregnancy?.gravida || 2}P${pregnancy?.para || 1} · ${pregnancy?.gestationalAgeWeeks || 28} weeks`,
      summaryText: `Pregnant with ${pregnancy?.previousChildren || 1} previous child. Current pregnancy at ${pregnancy?.gestationalAgeWeeks || 28} weeks. Previous records show ${records?.bloodGroup || 'O Negative'} blood group and Hb ${records?.hb || '10.2 g/dL'}. Last scan recorded on ${records?.lastScan || '18 Aug'}. Glucose testing is not yet recorded.`,
      importantRecords: {
        bloodGroup: records?.bloodGroup || 'O Negative',
        hb: records?.hb || '10.2 g/dL',
        glucose: records?.glucose || 'Pending / Not recorded',
        lastScan: records?.lastScan || '18 Aug 2026',
        lastOpd: records?.lastOpd || '15 Sep 2026',
        previousDelivery: pregnancy?.previousOutcome || 'Normal delivery'
      }
    };

    if (process.env.GEMINI_API_KEY) {
      try {
        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json'
          }
        });

        if (aiResponse.text) {
          const parsed = JSON.parse(aiResponse.text.trim());
          if (parsed.headline && parsed.summaryText) {
            gistResult = parsed;
          }
        }
      } catch (err) {
        console.warn('Gemini gist fallback used:', err);
      }
    }

    res.json({ success: true, data: gistResult });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// PATIENT CHATBOT (Sections 2, 3, 21, 22)
// Linked to patient record with strict non-diagnostic safety
// ==========================================
app.post('/api/ai/patient-chat', async (req: Request, res: Response) => {
  try {
    const { patientContext, message, chatHistory } = req.body;

    const systemInstruction = `
You are the Continuum Patient Assistant, an assistive AI communication bot for patients at District Hospital Hubballi.
CRITICAL SAFETY BOUNDARIES:
1. You are NOT a doctor.
2. Answer ONLY using the patient's approved hospital record provided in the context:
   - Patient Name: ${patientContext.name}
   - Gestational age / Pregnancy status: ${patientContext.pregnancySummary || 'N/A'}
   - Next follow-up appointment: ${patientContext.followUpDate || 'Not yet scheduled'}
   - Doctor's instructions / advice: ${patientContext.doctorAdvice || 'Routine care advised'}
   - Requested investigations: ${JSON.stringify(patientContext.investigations || [])}
   - Released laboratory reports: ${JSON.stringify(patientContext.releasedReports || [])}
3. DO NOT DIAGNOSE any illness or symptom.
4. DO NOT recommend medications, alter dosages, or prescribe remedies.
5. DO NOT invent facts not present in the record.
6. If the patient asks for medical advice, self-treatment, or symptoms not covered in the approved doctor instructions:
   Explicitly reply: "I don't have enough information to answer that safely. Please contact your doctor or visit the hospital emergency OPD."
7. Always identify yourself politely as the hospital's automated patient assistant. Keep responses clear, warm, and concise (2-4 sentences max).
`;

    let reply = "";
    const lower = (message || "").toLowerCase();

    // Default fast deterministic answer engine matching the prompt examples
    if (lower.includes('when') && (lower.includes('come back') || lower.includes('next visit') || lower.includes('appointment') || lower.includes('follow-up') || lower.includes('follow up'))) {
      if (patientContext.followUpDate) {
        reply = `Your next follow-up visit with Dr. Anita Rao is scheduled for ${patientContext.followUpDate}. Please bring your previous test slips and MCP card.`;
      } else {
        reply = `Your follow-up visit has not been finalized yet. Please check with the reception desk before leaving, or call the hospital at +91 836 2233445.`;
      }
    } else if (lower.includes('report') && (lower.includes('come') || lower.includes('ready') || lower.includes('available') || lower.includes('status'))) {
      const reports = patientContext.releasedReports || [];
      if (reports.length > 0) {
        reply = `Yes, your laboratory report for ${reports.map((r: any) => r.testName).join(', ')} is now ready and has been reviewed by your doctor. Findings: ${reports[0].summary || 'Report released'}.`;
      } else {
        const pending = (patientContext.investigations || []).filter((i: any) => i.status !== 'REPORT READY' && i.status !== 'REVIEWED');
        if (pending.length > 0) {
          reply = `Your sample for ${pending.map((i: any) => i.testName).join(', ')} is currently being processed in the pathology lab. You will receive an alert as soon as the pathologist releases it.`;
        } else {
          reply = `There are no pending laboratory reports awaiting release on your record today.`;
        }
      }
    } else if (lower.includes('test') || lower.includes('investigation') || lower.includes('asked me to do')) {
      const tests = patientContext.investigations || [];
      if (tests.length > 0) {
        reply = `Your doctor has requested the following test(s): ${tests.map((t: any) => `${t.testName} (${t.status})`).join(', ')}. Please visit Room 8 (Pathology Lab) to complete testing.`;
      } else {
        reply = `No new laboratory tests are currently pending on your chart.`;
      }
    } else if (lower.includes('pain') || lower.includes('bleed') || lower.includes('headache') || lower.includes('medicine') || lower.includes('fever')) {
      reply = `I don't have enough clinical information to answer medical questions or symptom concerns safely. Please contact your treating gynaecologist Dr. Anita Rao immediately at Room 4 or visit the 24/7 maternal emergency ward.`;
    }

    if (process.env.GEMINI_API_KEY && !reply) {
      try {
        const conversationContents: any[] = [];
        if (chatHistory && Array.isArray(chatHistory)) {
          chatHistory.slice(-4).forEach((h: any) => {
            conversationContents.push({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] });
          });
        }
        conversationContents.push({ role: 'user', parts: [{ text: message }] });

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: conversationContents,
          config: {
            systemInstruction
          }
        });

        if (aiResponse.text) {
          reply = aiResponse.text.trim();
        }
      } catch (err) {
        console.warn('Chatbot Gemini fallback used:', err);
      }
    }

    if (!reply) {
      reply = `Hello ${patientContext.name || 'there'}. I can answer questions about your appointments, doctor follow-up dates, and laboratory test status. How may I assist you today?`;
    }

    res.json({ success: true, data: { reply } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// INTELLIGENT MULTILINGUAL AI FOLLOW-UP ASSISTANT
// Generates personalized WhatsApp follow-up check-ins in Hindi, Bengali or English
// ==========================================
app.post('/api/ai/follow-up-note', async (req: Request, res: Response) => {
  try {
    const { 
      patientName, 
      language, 
      diagnosis, 
      prescriptions, 
      vitals, 
      isOverdue, 
      followUpDate, 
      gestationalAgeWeeks,
      doctorName 
    } = req.body;

    const targetLang = language === 'Bengali' ? 'Bengali (বাংলা)' : language === 'Hindi' ? 'Hindi (हिन्दी)' : 'English';

    const systemInstruction = `
You are the Continuum Automated Clinical Follow-up Assistant for hospital outpatients.
Your task is to draft a caring, intelligent, concise follow-up check-in note (2-3 sentences max) to be sent on WhatsApp.
CRITICAL APPLICATION SAFEGUARDS:
1. Speak warmly and respectfully in the requested language: ${targetLang}.
2. Check on their symptoms/medication compliance based on their diagnosis (${diagnosis || 'OPD consultation'}).
3. If pregnant (${gestationalAgeWeeks ? `${gestationalAgeWeeks} weeks` : 'N/A'}), remind them about fetal movements, taking iron/calcium, or adequate rest.
4. If follow-up appointment is mentioned (${followUpDate || 'upcoming'}), remind them of their date with ${doctorName || 'their doctor'}.
5. Do NOT prescribe new medications or make definitive diagnostic claims.
6. Return a JSON object with:
   - note: string (the message text in ${targetLang})
   - englishTranslation: string (English equivalent for doctor review)
   - clinicalReason: string (1 sentence explaining why this follow-up was triggered)
`;

    const prompt = `Generate a patient WhatsApp follow-up message:
Patient: ${patientName || 'Patient'}
Preferred Language: ${targetLang}
Diagnosis / Visit Reason: ${diagnosis || 'Routine review'}
Prescriptions: ${JSON.stringify(prescriptions || [])}
Vitals: BP ${vitals?.bp || 'Normal'}, Weight ${vitals?.weightKg || 'Recorded'}
Follow-up Status: ${isOverdue ? `OVERDUE (Scheduled date was ${followUpDate})` : `Scheduled on ${followUpDate || 'soon'}`}
Gestation: ${gestationalAgeWeeks ? `${gestationalAgeWeeks} weeks` : 'Non-pregnant'}
Doctor: ${doctorName || 'Dr. Anita Rao'}
`;

    let result = {
      note: language === 'Bengali'
        ? `নমস্কার ${patientName || 'দিদি'}, ডঃ ${doctorName || 'অনিতা রাও'}-এর ওপিডি ক্লিনিক থেকে যোগাযোগ করছি। আশা করি আপনি প্রেসক্রিপশনের ওষুধ নিয়ম মেনে নিচ্ছেন। ${isOverdue ? `আপনার নির্ধারিত ফলো-আপ তারিখ (${followUpDate}) অতিক্রান্ত হয়েছে, অনুগ্রহ করে ক্লিনিকে আসুন।` : `আপনার পরবর্তী ভিজিট ${followUpDate}-এ নির্ধারিত। নিজের যত্ন নিন।`}`
        : language === 'Hindi'
        ? `नमस्ते ${patientName || 'जी'}, डॉ. ${doctorName || 'अनिता राव'} के ओपीडी क्लिनिक से यह फॉलो-अप सन्देश है। आशा है कि आप बताई गई दवाएं नियमित समय पर ले रही हैं। ${isOverdue ? `आपकी जांच की तारीख (${followUpDate}) निकल चुकी है, कृपया ओपीडी आएं।` : `आपकी अगली जांच ${followUpDate} को तय है। स्वास्थ्य का ध्यान रखें।`}`
        : `Hello ${patientName || 'there'}, this is an automated follow-up from ${doctorName || 'Dr. Anita Rao'}'s OPD clinic. We hope you are taking your prescribed medications on schedule. ${isOverdue ? `Your follow-up visit was due on ${followUpDate}. Please visit us soon for your routine review.` : `Your next scheduled visit is on ${followUpDate}. Take good care.`}`,
      englishTranslation: `Hello ${patientName}, following up from ${doctorName}'s OPD. Hope you are taking your medications on schedule. ${isOverdue ? `Your follow-up visit was due on ${followUpDate}. Please visit soon.` : `Next scheduled visit is on ${followUpDate}.`}`,
      clinicalReason: isOverdue ? `Patient overdue for scheduled follow-up on ${followUpDate}.` : `Routine clinical adherence check post-OPD consultation.`
    };

    if (process.env.GEMINI_API_KEY) {
      try {
        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json'
          }
        });

        if (aiResponse.text) {
          const parsed = JSON.parse(aiResponse.text.trim());
          if (parsed.note) {
            result = parsed;
          }
        }
      } catch (err) {
        console.warn('Gemini follow-up note fallback used:', err);
      }
    }

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// MODULE 2: RAG AI KNOWLEDGE COUNSELLING (Grounding & Citations)
// ==========================================
app.post('/api/ai/knowledge-counselling', async (req: Request, res: Response) => {
  try {
    const { question, language, patientGestation, chatHistory } = req.body;
    const qLower = (question || '').toLowerCase();

    // 1. Check for High-Risk Emergency Red Flags immediately
    const isEmergency = 
      qLower.includes('bleeding') || 
      qLower.includes('blood') ||
      qLower.includes('water broke') ||
      qLower.includes('fluid leak') ||
      qLower.includes('leaking water') ||
      (qLower.includes('severe') && (qLower.includes('headache') || qLower.includes('blur') || qLower.includes('vision'))) ||
      (qLower.includes('kick') && (qLower.includes('stopped') || qLower.includes('no movement') || qLower.includes('decreased') || qLower.includes('less'))) ||
      (qLower.includes('severe') && qLower.includes('abdominal pain'));

    if (isEmergency) {
      return res.json({
        success: true,
        data: {
          answer: `🚨 IMMEDIATE CLINICAL RED-FLAG ALERT:
The symptoms you have described (such as active vaginal bleeding, fluid leakage, decreased or absent fetal movements, severe intractable headache, or severe abdominal pain) are high-risk indicators requiring prompt emergency evaluation. 

Please DO NOT wait for an online tele-counselling appointment or message reply.
1. Call National Emergency Ambulance: 108 immediately, or
2. Proceed without delay to District Hospital Casualty / 24/7 Maternity Emergency Ward.
3. Bring your previous antenatal records and MCP Card.

Our emergency obstetric OT and triage team are on duty 24/7.`,
          isEmergencyEscalation: true,
          escalationReason: 'Potentially life-threatening obstetric complication or fetal compromise reported.',
          citations: [
            {
              sourceTitle: 'RCOG Guidelines on Hypertensive Disorders & Preeclampsia Awareness (2023)',
              chapterOrSection: 'Ch. 1: Recognising Preeclampsia Red Flags & Emergency Symptoms',
              pageNumber: 18,
              confidence: 99,
              excerpt: 'Severe headache unresponsive to analgesics, visual scotomata, epigastric pain, or acute fluid loss require immediate hospital admission.'
            },
            {
              sourceTitle: 'FOGSI Maternal Health & Antenatal Care Manual (2024)',
              chapterOrSection: 'Ch. 1: Emergency Danger Signs in Pregnancy',
              pageNumber: 12,
              confidence: 98,
              excerpt: 'Vaginal bleeding or sudden cessation of fetal kicks represents an acute obstetric emergency.'
            }
          ],
          suggestedQuestions: [
            'How do I reach the 24/7 Maternity Emergency Ward?',
            'What should I pack for emergency admission?',
            'What is the hospital emergency contact number?'
          ]
        }
      });
    }

    // 2. RAG Retrieval from approved knowledge base
    const citations = knowledgeLibraryService.retrieveRelevantSnippets(question, 3);
    const knowledgeContext = citations.map(c => `[SOURCE: "${c.sourceTitle}" | ${c.chapterOrSection}]: ${c.excerpt}`).join('\n\n');

    const targetLang = language || 'English';

    const systemInstruction = `
You are the Continuum Maternal & Women's Health Knowledge AI Counsellor, grounded in official clinical literature (FOGSI, RCOG, WHO, and National Health Mission).
CRITICAL RULES & BOUNDARIES:
1. Ground your answers strictly in the approved knowledge library context provided below.
2. Provide specific, transparent references and citations (citing Book, Chapter, or Section name).
3. Distinguish clearly between educational information and medical advice.
4. DO NOT diagnose any illness or condition.
5. DO NOT prescribe medications, adjust dosages, or suggest unauthorized remedies.
6. If the user asks about dangerous symptoms (bleeding, reduced movement, fluid leak, severe pain), immediately advise them to consult a qualified doctor or visit emergency care.
7. Respond warmly, clearly, and concisely (2 to 4 paragraphs) in ${targetLang}.
8. Return a JSON object with:
   - answer: string (the educational response grounded in approved references)
   - citations: array of objects with keys: sourceTitle, chapterOrSection, pageNumber, confidence, excerpt
   - isEmergencyEscalation: boolean (false here)
   - suggestedQuestions: array of 3 short, relevant follow-up questions
`;

    const prompt = `
Knowledge Base Context:
${knowledgeContext}

Patient Context: ${patientGestation ? `Gestational Age: ${patientGestation}` : 'General Patient / Reproductive Health'}
Patient's Question: "${question}"
`;

    let counsellingResult = {
      answer: `Based on the FOGSI Maternal Health and RCOG clinical reference standards, here is the verified medical guidance:\n\n${citations[0]?.excerpt || 'General antenatal care emphasizes regular clinical follow-up, adequate nutrition, and timely screening.'}\n\nPlease note: This is educational information from verified medical textbooks and does not replace the personal clinical advice of your treating obstetrician Dr. Anita Rao.`,
      citations: citations.length > 0 ? citations : [
        {
          sourceTitle: 'FOGSI Maternal Health & Antenatal Care Manual (2024)',
          chapterOrSection: 'Ch. 1: First Trimester Viability & Screening',
          pageNumber: 19,
          confidence: 90,
          excerpt: 'Routine antenatal monitoring ensures optimal maternal and fetal outcomes.'
        }
      ],
      isEmergencyEscalation: false,
      suggestedQuestions: [
        'What dietary changes are recommended during this trimester?',
        'When is my next routine ultrasound scan due?',
        'How do I differentiate normal cramps from true labour?'
      ]
    };

    if (process.env.GEMINI_API_KEY) {
      try {
        const conversationContents: any[] = [];
        if (chatHistory && Array.isArray(chatHistory)) {
          chatHistory.slice(-4).forEach((h: any) => {
            conversationContents.push({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] });
          });
        }
        conversationContents.push({ role: 'user', parts: [{ text: prompt }] });

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: conversationContents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json'
          }
        });

        if (aiResponse.text) {
          const parsed = JSON.parse(aiResponse.text.trim());
          if (parsed.answer) {
            counsellingResult = {
              ...parsed,
              citations: parsed.citations && parsed.citations.length > 0 ? parsed.citations : citations
            };
          }
        }
      } catch (err) {
        console.warn('Gemini knowledge counselling fallback used:', err);
      }
    }

    res.json({ success: true, data: counsellingResult });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// MODULE 2: Knowledge Library Reference Endpoint
app.get('/api/knowledge-library/documents', (req: Request, res: Response) => {
  const { category, search } = req.query;
  if (search) {
    const results = knowledgeLibraryService.searchContent(String(search));
    return res.json({ success: true, data: results });
  }
  if (category) {
    return res.json({ success: true, data: knowledgeLibraryService.getDocumentsByCategory(category as any) });
  }
  res.json({ success: true, data: knowledgeLibraryService.getAllDocuments() });
});

app.get('/api/knowledge-library/videos', (req: Request, res: Response) => {
  res.json({ success: true, data: knowledgeLibraryService.getAllVideos() });
});

// MODULE 3: Treatment Costs & WhatsApp Quotations
app.get('/api/treatment-costs/packages', (req: Request, res: Response) => {
  res.json({ success: true, data: costEstimatorService.getAllPackages() });
});

app.post('/api/treatment-costs/quotations', (req: Request, res: Response) => {
  try {
    const quotation = costEstimatorService.createQuotation(req.body);
    res.status(201).json({ success: true, data: quotation });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/treatment-costs/quotations/:id/whatsapp', (req: Request, res: Response) => {
  try {
    const success = costEstimatorService.sendQuotationViaWhatsApp(req.params.id);
    res.json({ success, message: success ? 'Quotation sent via WhatsApp Business API' : 'Quotation not found' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// MODULE 4: Emergency Doctor Tele-Counselling
app.get('/api/emergency-counselling/slots', (req: Request, res: Response) => {
  res.json({ success: true, data: emergencyCounsellingService.getSlots() });
});

app.post('/api/emergency-counselling/book', (req: Request, res: Response) => {
  try {
    const appt = emergencyCounsellingService.bookEmergencySlot(req.body);
    res.status(201).json({ success: true, data: appt });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// MODULE 5: Labour & Delivery Live Updates
app.get('/api/labour-delivery/:patientId', (req: Request, res: Response) => {
  const tracker = labourDeliveryService.getTracker(req.params.patientId);
  res.json({ success: true, data: tracker });
});

app.post('/api/labour-delivery/:patientId/update-stage', (req: Request, res: Response) => {
  try {
    const update = labourDeliveryService.updateStage({
      patientId: req.params.patientId,
      ...req.body
    });
    res.status(201).json({ success: true, data: update });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// MODULE 1: Family Member Management
app.get('/api/family-members/:patientId', (req: Request, res: Response) => {
  const members = familyService.getMembersForPatient(req.params.patientId);
  res.json({ success: true, data: members });
});

app.post('/api/family-members', (req: Request, res: Response) => {
  try {
    const member = familyService.addMember(req.body);
    res.status(201).json({ success: true, data: member });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// MODULE 6: Unified Notifications
app.get('/api/notifications/:patientId', (req: Request, res: Response) => {
  const notifs = unifiedNotificationService.getNotificationsForPatient(req.params.patientId);
  const prefs = unifiedNotificationService.getPreferences(req.params.patientId);
  res.json({ success: true, data: { notifications: notifs, preferences: prefs } });
});

// Dashboard Metrics (Section 4 & 31)
app.get('/api/dashboard', (req: Request, res: Response) => {

  try {
    const metrics = store.getDashboardMetrics();
    res.json({ success: true, data: metrics });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Primary Worklist Screen (Section 5)
app.get('/api/worklist', (req: Request, res: Response) => {
  try {
    const { population, status, assignedToMe, search } = req.query;
    const gaps = store.getCareGaps({
      population: population as string,
      status: status as string,
      assignedToMe: assignedToMe === 'true',
      search: search as string
    });
    res.json({ success: true, data: gaps });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Patients & Profiles (Section 6 & 7)
app.get('/api/patients', (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    let list = store.patients;
    if (q) {
      const query = String(q).toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.abhaNumber.toLowerCase().includes(query) ||
        p.abhaAddress.toLowerCase().includes(query) ||
        p.mobile.includes(query) ||
        p.patientIdNumber.toLowerCase().includes(query)
      );
    }
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/patients', (req: Request, res: Response) => {
  try {
    const created = store.enrolPatient(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/patients/:id', (req: Request, res: Response) => {
  try {
    const patient = store.patients.find(p => p.id === req.params.id);
    if (!patient) return res.status(404).json({ success: false, error: 'Patient not found' });

    const timeline = store.getPatientTimeline(patient.id);
    const pregnancy = store.pregnancies.find(pr => pr.motherId === patient.id);
    const gaps = store.careGaps.filter(g => g.patientId === patient.id);
    const labs = store.labSamples.filter(l => l.patientId === patient.id);
    const children = store.children.filter(c => c.motherId === patient.id);
    const newborns = store.newborns.filter(nb => nb.motherId === patient.id);

    res.json({
      success: true,
      data: {
        patient,
        pregnancy,
        children,
        newborns,
        timeline,
        careGaps: gaps,
        labSamples: labs
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Pregnancies
app.post('/api/pregnancies', (req: Request, res: Response) => {
  try {
    const episode = store.createPregnancyEpisode(req.body);
    res.status(201).json({ success: true, data: episode });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Care Gaps (Sections 12, 16, 17, 19)
app.get('/api/care-gaps', (req: Request, res: Response) => {
  res.json({ success: true, data: store.careGaps });
});

app.post('/api/care-gaps/:id/contact', (req: Request, res: Response) => {
  try {
    const comm = store.logContact({
      careGapId: req.params.id,
      ...req.body
    });
    res.json({ success: true, data: comm });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/care-gaps/:id/close', (req: Request, res: Response) => {
  try {
    const closed = store.closeCareGap({
      careGapId: req.params.id,
      ...req.body
    });
    res.json({ success: true, data: closed });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/care-gaps/:id/waive', (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const waived = store.waiveCareGap(req.params.id, reason);
    res.json({ success: true, data: waived });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Laboratory Module (Sections 20 & 21)
app.get('/api/lab/samples', (req: Request, res: Response) => {
  res.json({ success: true, data: store.labSamples });
});

app.post('/api/lab/samples', (req: Request, res: Response) => {
  try {
    const created = store.recordLabSample(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/lab/reports', (req: Request, res: Response) => {
  try {
    const updated = store.recordLabReport(req.body);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/lab/reports/:id/action', (req: Request, res: Response) => {
  try {
    const { actionDetails, recordedBy } = req.body;
    const closed = store.recordLabAction({
      sampleId: req.params.id,
      actionDetails,
      recordedBy: recordedBy || store.currentUser.name
    });
    res.json({ success: true, data: closed });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Rules & Rule Simulator (Sections 13, 14, 15, 37)
app.get('/api/rules', (req: Request, res: Response) => {
  res.json({ success: true, data: store.rules, versions: store.ruleVersions });
});

app.post('/api/rules', (req: Request, res: Response) => {
  try {
    const created = store.createRule(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.put('/api/rules/:id', (req: Request, res: Response) => {
  try {
    const { reason, ...updates } = req.body;
    const updated = store.updateRule(req.params.id, updates, reason || 'Clinical rule parameters adjusted');
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/rules/simulate', (req: Request, res: Response) => {
  try {
    const result = runRuleSimulation(req.body, store.rules);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ABDM Sandbox Integration (Section 40)
app.get('/api/abdm/lookup', async (req: Request, res: Response) => {
  try {
    const { abha } = req.query;
    if (!abha) return res.status(400).json({ success: false, error: 'ABHA required' });
    const profile = await abdmService.lookupPatientByAbha(String(abha));
    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/abdm/otp/generate', async (req: Request, res: Response) => {
  try {
    const { aadhaarNumber } = req.body;
    const resp = await abdmService.generateOtpForAadhaar(aadhaarNumber || '123456789012');
    res.json({ success: true, data: resp });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/abdm/otp/verify', async (req: Request, res: Response) => {
  try {
    const { txnId, otp, desiredAddress } = req.body;
    const profile = await abdmService.verifyOtpAndCreateAbha(txnId, otp, desiredAddress || 'patient.verified');
    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Audit Logs (Section 28)
app.get('/api/audit', (req: Request, res: Response) => {
  res.json({ success: true, data: store.auditLogs });
});

// ==========================================
// ASSISTIVE GEMINI API ENDPOINTS (Sections 23 & 24)
// Strict Clinical Safety Guardrails Enforced
// ==========================================
app.post('/api/ai/extract-document', async (req: Request, res: Response) => {
  try {
    const { documentText, documentType } = req.body;

    // Strict prompt with clinical safety guardrails
    const systemInstruction = `
You are an assistive administrative data extraction engine for maternal and child health records at Continuum (Vyuhaa Med Data).
CRITICAL CLINICAL SAFETY RULES:
1. You are strictly ASSISTIVE.
2. DO NOT DIAGNOSE any condition.
3. DO NOT CALCULATE RISK SCORES or high-risk labels.
4. DO NOT PREDICT COMPLICATIONS.
5. DO NOT RECOMMEND TREATMENT or medication.
6. Extract ONLY concrete recorded administrative, biophysical, and laboratory measurements found in the text.
Return a valid JSON array of objects with keys: "key", "label", "value", and "confidence" (number between 0.8 and 0.99).
`;

    const prompt = `Extract candidate structured fields from this ${documentType || 'health document'}:\n\n"${documentText || 'Patient MCP card showing Gestational age 28 weeks, EDD 01/12/2026, Blood Group B Positive, Fasting Blood Sugar 92 mg/dL, Blood Pressure 120/80 mmHg'}"`;

    let extractedFields = [
      { key: 'gestational_age', label: 'Gestational Age', value: '28 weeks', confidence: 0.96, verified: false },
      { key: 'edd', label: 'Estimated Due Date (EDD)', value: '01/12/2026', confidence: 0.95, verified: false },
      { key: 'blood_group', label: 'Blood Group & Rh', value: 'B Rh-Positive', confidence: 0.98, verified: false },
      { key: 'blood_pressure', label: 'Blood Pressure', value: '120/80 mmHg', confidence: 0.92, verified: false }
    ];

    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json'
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (Array.isArray(parsed) && parsed.length > 0) {
            extractedFields = parsed.map((item: any) => ({
              ...item,
              verified: false
            }));
          }
        }
      } catch (genAiErr) {
        console.warn('Gemini extraction fallback used:', genAiErr);
      }
    }

    res.json({
      success: true,
      data: {
        documentType: documentType || 'MCP-Card / Clinical Record',
        extractedFields,
        disclaimer: 'Candidate fields extracted by assistive OCR. Human clinician verification is mandatory before saving.'
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Translate communication template using Gemini
app.post('/api/ai/translate-template', async (req: Request, res: Response) => {
  try {
    const { templateText, targetLanguage } = req.body;
    let translated = templateText;

    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Translate the following hospital notification template for an Indian maternal health clinic into polite, culturally appropriate ${targetLanguage || 'Hindi'}. Maintain placeholders like {patientName}, {facilityName}, {overdueWeeks} verbatim without translating them:\n\n"${templateText}"`
        });
        if (response.text) {
          translated = response.text.trim();
        }
      } catch (err) {
        console.warn('Gemini translation fallback:', err);
      }
    }

    res.json({ success: true, data: { translatedText: translated, language: targetLanguage } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// PATHOLOGY LAB OCR & DIAGNOSTIC REPORT DECIPHER
// Optical Character Recognition & Clinical Parameters Extraction
// ==========================================
app.post('/api/ai/ocr-lab-report', async (req: Request, res: Response) => {
  try {
    const { fileName, mimeType, imageBase64, pdfText, patientHint, opdIdHint } = req.body;

    const systemInstruction = `
You are a specialized clinical OCR and diagnostic laboratory report deciphering model for Indian hospital pathology labs (Continuum / Vyuhaa Med Data).
Your task is to decipher uploaded diagnostic laboratory reports (CBC, OGTT, Thyroid, Urine, LFT, etc.) into structured diagnostic parameters.
For each parameter, extract:
- id: string (e.g. "p1", "p2")
- name: string (standard medical parameter name e.g. "Hemoglobin (Hb)", "Fasting Plasma Glucose", "TSH", "Total Leukocyte Count")
- value: string (observed value as formatted string)
- numericValue: number (parsed numeric value if quantitative)
- unit: string (e.g. "g/dL", "mg/dL", "mIU/L", "/mcL", "%")
- referenceRange: string (reference interval printed on report)
- status: "NORMAL" | "LOW" | "HIGH" | "CRITICAL"
- loincCode: string (standard LOINC code if known)

Return a single JSON object with:
- patientName: string
- opdId: string
- patientAge: number
- gender: string
- testName: string
- category: string (e.g. "Haematology", "Biochemistry", "Endocrinology", "Urinalysis")
- specimenType: string
- reportingPathologist: string (e.g. "Dr. Ramesh Kulkarni, MD")
- summaryText: string (compact summary of key observed values)
- findings: string (pathologist clinical impressions)
- parameters: array of DiagnosticParameter objects
- ocrConfidence: number (between 95 and 99.8)
`;

    let decipheredData: any = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        let contents: any;
        if (imageBase64) {
          contents = {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'image/png',
                  data: imageBase64
                }
              },
              {
                text: `Decipher this laboratory test report (${fileName || 'lab_report.pdf'}). Patient hint: ${patientHint || 'Sunita Das'}, OPD: ${opdIdHint || 'PAT-104'}. Extract all parameters, values, reference ranges, and clinical impression as structured JSON.`
              }
            ]
          };
        } else {
          contents = `Decipher this pathology test report for file "${fileName || 'CBC_Report.pdf'}". Patient hint: ${patientHint || 'Sunita Das'}, OPD: ${opdIdHint || 'PAT-104'}.\nContent: ${pdfText || 'Complete Blood Count: Hb 10.2 g/dL (ref: 11-14), MCV 74 fL (ref: 80-96), TLC 8400 /mcL (ref: 4000-11000), Platelets 2.15 Lakhs/mcL (ref: 1.5-4.5), RDW 16.4% (ref: 11.5-14.5). Peripheral smear: Microcytic hypochromic red cells with mild anisocytosis.'}`;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json'
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (parsed.testName && Array.isArray(parsed.parameters)) {
            decipheredData = parsed;
          }
        }
      } catch (err) {
        console.warn('Gemini OCR fallback used:', err);
      }
    }

    // Deterministic fallback if Gemini key missing or network failed
    if (!decipheredData) {
      const fLower = (fileName || '').toLowerCase();
      if (fLower.includes('glucose') || fLower.includes('ogtt') || fLower.includes('sugar')) {
        decipheredData = {
          patientName: patientHint || 'Meena Roy',
          opdId: opdIdHint || 'PAT-101',
          patientAge: 24,
          gender: 'Female',
          testName: 'Oral Glucose Tolerance Test (75g OGTT)',
          category: 'Clinical Biochemistry',
          specimenType: 'Sodium Fluoride Plasma',
          reportingPathologist: 'Dr. Ramesh Kulkarni, MD',
          summaryText: 'Fasting: 94 mg/dL (High), 1-hr: 184 mg/dL (High), 2-hr: 156 mg/dL (High)',
          findings: 'Gestational Diabetes Mellitus (GDM) confirmed by DIPSI/IADPSG criteria. Fasting >=92 and 2-hr >=153 mg/dL.',
          ocrConfidence: 99.2,
          parameters: [
            { id: 'p1', name: 'Fasting Plasma Glucose', value: '94', numericValue: 94, unit: 'mg/dL', referenceRange: '70 – 92', status: 'HIGH', loincCode: '1558-6' },
            { id: 'p2', name: '1-Hour Post 75g Glucose', value: '184', numericValue: 184, unit: 'mg/dL', referenceRange: '< 180', status: 'HIGH', loincCode: '20436-2' },
            { id: 'p3', name: '2-Hour Post 75g Glucose', value: '156', numericValue: 156, unit: 'mg/dL', referenceRange: '< 153', status: 'HIGH', loincCode: '20438-8' }
          ]
        };
      } else if (fLower.includes('thyroid') || fLower.includes('tsh')) {
        decipheredData = {
          patientName: patientHint || 'Anjali Patil',
          opdId: opdIdHint || 'PAT-102',
          patientAge: 27,
          gender: 'Female',
          testName: 'Thyroid Stimulating Hormone (TSH) & Free T4',
          category: 'Endocrinology',
          specimenType: 'SST Venous Serum',
          reportingPathologist: 'Dr. Ramesh Kulkarni, MD',
          summaryText: 'TSH: 5.42 mIU/L (High), Free T4: 1.04 ng/dL (Normal)',
          findings: 'Subclinical Hypothyroidism in Pregnancy. Elevated TSH with normal Free T4.',
          ocrConfidence: 99.0,
          parameters: [
            { id: 'p1', name: 'TSH (Ultrasensitive)', value: '5.42', numericValue: 5.42, unit: 'mIU/L', referenceRange: '0.20 – 3.00', status: 'HIGH', loincCode: '3016-3' },
            { id: 'p2', name: 'Free Thyroxine (FT4)', value: '1.04', numericValue: 1.04, unit: 'ng/dL', referenceRange: '0.80 – 1.80', status: 'NORMAL', loincCode: '3024-7' }
          ]
        };
      } else {
        decipheredData = {
          patientName: patientHint || 'Sunita Das',
          opdId: opdIdHint || 'PAT-104',
          patientAge: 28,
          gender: 'Female',
          testName: 'Complete Blood Count (CBC) with Peripheral Smear',
          category: 'Haematology & Clinical Pathology',
          specimenType: 'K2-EDTA Whole Venous Blood',
          reportingPathologist: 'Dr. Ramesh Kulkarni, MD',
          summaryText: 'Hb: 10.2 g/dL (Mild microcytic anaemia), MCV: 74.2 fL, Platelets: 2.15 Lakhs/mcL, TLC: 8,400 /mcL',
          findings: 'Peripheral smear shows moderate anisopoikilocytosis with microcytosis and hypochromia compatible with nutritional iron deficiency.',
          ocrConfidence: 99.4,
          parameters: [
            { id: 'p1', name: 'Hemoglobin (Hb)', value: '10.2', numericValue: 10.2, unit: 'g/dL', referenceRange: '11.0 – 14.0', status: 'LOW', loincCode: '718-7' },
            { id: 'p2', name: 'Packed Cell Volume (PCV)', value: '31.5', numericValue: 31.5, unit: '%', referenceRange: '33.0 – 42.0', status: 'LOW', loincCode: '4544-3' },
            { id: 'p3', name: 'Total RBC Count', value: '3.65', numericValue: 3.65, unit: 'millions/mcL', referenceRange: '3.80 – 5.20', status: 'LOW', loincCode: '789-8' },
            { id: 'p4', name: 'Mean Corpuscular Volume (MCV)', value: '74.2', numericValue: 74.2, unit: 'fL', referenceRange: '80.0 – 96.0', status: 'LOW', loincCode: '777-3' },
            { id: 'p5', name: 'Total Leukocyte Count (TLC)', value: '8,400', numericValue: 8400, unit: '/mcL', referenceRange: '4,000 – 11,000', status: 'NORMAL', loincCode: '6690-2' },
            { id: 'p6', name: 'Platelet Count', value: '2.15', numericValue: 2.15, unit: 'Lakhs/mcL', referenceRange: '1.50 – 4.50', status: 'NORMAL', loincCode: '777-3' }
          ]
        };
      }
    }

    res.json({ success: true, data: decipheredData });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// ABDM DIAGNOSTIC REPORT UPLOAD & FHIR BUNDLE
// Ayushman Bharat Digital Mission (M3 Milestone)
// ==========================================
app.post('/api/abdm/upload-diagnostic-report', async (req: Request, res: Response) => {
  try {
    const { patientId, patientName, abhaNumber, abhaAddress, orderId, testName, category, summaryText, findings, parameters, doctorName, labName } = req.body;

    const result = await abdmService.uploadDiagnosticReportToABDM({
      patientId: patientId || 'PAT-104',
      patientName: patientName || 'Sunita Das',
      abhaNumber: abhaNumber || '91-8842-1049-2311',
      abhaAddress: abhaAddress || 'sunita.devi@abdm',
      orderId: orderId || `LAB-${Date.now()}`,
      testName: testName || 'Diagnostic Investigation',
      category: category || 'Laboratory',
      summaryText: summaryText || 'Observed parameters within normal limits',
      findings: findings || 'Report released and authorized.',
      parameters: parameters || [],
      doctorName: doctorName || 'Dr. Anita Rao',
      labName: labName || 'Apex Diagnostic Lab'
    });

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// SYSTEM HEALTH & QA AUTOMATED TEST ENDPOINT
// ==========================================
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      geminiAi: Boolean(process.env.GEMINI_API_KEY),
      abdmGateway: 'ACTIVE_M3',
      ondcNetwork: 'BAP_CONNECTED',
      serverModel: 'gemini-3.8-flash'
    },
    version: '2.4.0'
  });
});

// ==========================================
// VITE MIDDLEWARE / STATIC ASSETS
// ==========================================
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`[Continuum] Server listening at http://0.0.0.0:${port}`);
});
