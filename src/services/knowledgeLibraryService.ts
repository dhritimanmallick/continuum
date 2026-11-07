import { KnowledgeDocument, KnowledgeVideoResource, KnowledgeCategory, RagCitation } from '../types';

export const KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc-fogsi-2024',
    title: 'FOGSI Maternal Health & Antenatal Care Manual',
    author: 'Federation of Obstetric and Gynaecological Societies of India (FOGSI)',
    publisherOrSource: 'FOGSI Academic Press',
    editionYear: 2024,
    category: 'FIRST_TRIMESTER',
    description: 'Gold-standard clinical guidebook for antenatal screening, trimester milestones, nutritional supplementation, and maternal physiological adaptations across Indian clinical settings.',
    estimatedReadMinutes: 45,
    language: 'English',
    tags: ['FOGSI', 'Antenatal', 'Nutrition', 'Iron Deficiency', 'Ultrasound'],
    isFeatured: true,
    chapters: [
      {
        id: 'fogsi-ch1',
        chapterNumber: 1,
        title: 'First Trimester Viability, Dating Scans & Dual Marker Screening',
        content: 'The first trimester (0 to 13 weeks) requires viability confirmation by transvaginal or transabdominal ultrasound, establishing accurate crown-rump length (CRL) dating. A combined screening test consisting of Nuchal Translucency (NT) scan at 11w0d to 13w6d plus serum PAPP-A and free beta-hCG assesses chromosomal aneuploidy risk. Folic acid supplementation (5 mg/day in high-risk or 500 mcg/day standard) must begin pre-conceptually and continue through 12 weeks to prevent neural tube defects.',
        keyTakeaways: [
          'Ultrasound CRL between 11-13 weeks provides the most accurate estimated date of delivery (EDD).',
          'Daily folic acid prevents neural tube defects.',
          'Early baseline investigations include blood group, Rh factor, complete blood count, and infectious serologies.'
        ],
        clinicalPearls: [
          'If mother is Rh-negative, partner Rh testing and early indirect Coombs test (ICT) should be completed by 12 weeks.'
        ],
        warningSigns: [
          'Bright red vaginal bleeding or spotting',
          'Sharp unilateral pelvic cramping (ectopic exclusion required)',
          'Hyperemesis gravidarum with ketonuria'
        ]
      },
      {
        id: 'fogsi-ch2',
        chapterNumber: 2,
        title: 'Nutritional Guidelines & Preventing Anaemia in Pregnancy',
        content: 'Nutritional iron deficiency anaemia remains the most common maternal morbidity in India. FOGSI guidelines recommend 60 mg elemental iron and 500 mcg folic acid daily starting at 14 weeks of gestation, accompanied by 1000 mg elemental calcium daily (taken at least 2 hours apart from iron to avoid absorption competition). Protein requirement increases by 25g/day, achievable through lentils, paneer, eggs, dairy, and sprouted pulses. Dietary advice should emphasize vitamin C co-ingestion (citrus fruits, amla) with iron tablets.',
        keyTakeaways: [
          'Take iron and calcium tablets at different times of the day (e.g., iron in morning, calcium at night).',
          'Target minimum Hemoglobin is 11.0 g/dL in 1st & 3rd trimesters, and 10.5 g/dL in 2nd trimester.',
          'Weight gain target is typically 10–12 kg for normal BMI mothers.'
        ],
        clinicalPearls: [
          'Tea and coffee contain tannins that severely inhibit iron absorption; avoid within 1 hour of taking iron supplements.'
        ],
        warningSigns: [
          'Severe breathlessness on mild exertion (Hb < 7 g/dL alert)',
          'Palpitations or resting tachycardia',
          'Postural dizziness or fainting'
        ]
      },
      {
        id: 'fogsi-ch3',
        chapterNumber: 3,
        title: 'Gestational Diabetes Mellitus (GDM) & The DIPSI 75g Protocol',
        content: 'Universal screening for Gestational Diabetes Mellitus is recommended for all Indian pregnant women at booking and repeated at 24–28 weeks. The single-step 75g Oral Glucose Tolerance Test (DIPSI method) involves administering 75g anhydrous glucose dissolved in 300ml water regardless of last meal. A 2-hour venous plasma glucose of >= 140 mg/dL establishes the diagnosis of GDM. Management begins with Medical Nutrition Therapy (MNT) with a carbohydrate cap at 50-55% of caloric intake, split into small frequent meals.',
        keyTakeaways: [
          'Universal 75g OGTT screening is vital because Indian women have an elevated ethnic predisposition to insulin resistance.',
          'Target fasting glucose is < 95 mg/dL; 2-hour postprandial target is < 120 mg/dL.',
          'Fetal abdominal circumference monitoring by ultrasound prevents macrosomia.'
        ],
        clinicalPearls: [
          'Walking 15-20 minutes after main meals significantly dampens postprandial glucose excursions.'
        ],
        warningSigns: [
          'Excessive unquenchable thirst and polyuria',
          'Sudden accelerated fundal height discrepancy (polyhydramnios check)'
        ]
      }
    ]
  },
  {
    id: 'doc-rcog-highrisk',
    title: 'RCOG Guidelines on Hypertensive Disorders & Preeclampsia Awareness',
    author: 'Royal College of Obstetricians and Gynaecologists (RCOG)',
    publisherOrSource: 'RCOG Scientific Advisory Committee',
    editionYear: 2023,
    category: 'HIGH_RISK_AWARENESS',
    description: 'Evidence-based protocols on diagnosing gestational hypertension, preeclampsia, fetal growth restriction, and identifying urgent danger signals requiring emergency hospital admission.',
    estimatedReadMinutes: 35,
    language: 'English',
    tags: ['RCOG', 'Preeclampsia', 'Hypertension', 'Red Flags', 'Doppler'],
    isFeatured: true,
    chapters: [
      {
        id: 'rcog-ch1',
        chapterNumber: 1,
        title: 'Recognising Preeclampsia Red Flags & Emergency Symptoms',
        content: 'Preeclampsia is defined as new-onset hypertension (blood pressure >= 140/90 mmHg on two occasions at least 4 hours apart) occurring after 20 weeks of gestation, accompanied by proteinuria or maternal organ dysfunction. Red flag symptoms indicate impending severe complications or eclampsia: frontal pounding headache unresponsive to paracetamol, visual disturbances (scotomata, blurriness, photophobia), epigastric or right upper quadrant pain (hepatic capsule stretch), sudden facial or pedal oedema, and hyperreflexia.',
        keyTakeaways: [
          'Severe headache and visual blurring are never normal in late pregnancy and demand immediate BP checking.',
          'Epigastric pain in third trimester must be evaluated for HELLP syndrome.',
          'Home BP monitoring is recommended for women with baseline blood pressure above 130/80 mmHg.'
        ],
        clinicalPearls: [
          'Low-dose aspirin (150 mg nightly) initiated prior to 16 weeks reduces preeclampsia incidence by up to 60% in high-risk pregnancies.'
        ],
        warningSigns: [
          'Persistent severe frontal or occipital headache',
          'Flashing lights, dark spots, or blurred vision',
          'Severe epigastric pain or nausea in the 3rd trimester',
          'Sudden swelling of face, hands, or eyes within 24 hours'
        ]
      },
      {
        id: 'rcog-ch2',
        chapterNumber: 2,
        title: 'Fetal Movement Monitoring (The "Kick Count" Protocol)',
        content: 'Maternal perception of fetal movement (quickening) generally commences between 18 to 22 weeks. By 28 weeks, fetal movement reflects fetal neurological and autonomic integrity. Women should become familiar with their baby\'s individual pattern of movements. A reliable protocol is the "Cardiff Count-to-Ten" or recognizing at least 10 discrete movements within a 2-hour period while resting comfortably on the left side following a meal. Reduced or absent fetal movements is a major red flag warranting immediate non-stress test (NST) and ultrasound.',
        keyTakeaways: [
          'Fetal movements do not decrease in the 9th month; the character of movement changes from kicks to rolling sensations.',
          'Never wait overnight or till next morning if fetal movements are markedly reduced or stopped.',
          'Left lateral decubitus positioning optimizes uteroplacental blood flow during observation.'
        ],
        clinicalPearls: [
          'Sugary drinks or cold water do not replace formal Cardiotocography (CTG) evaluation if the mother is concerned about movement.'
        ],
        warningSigns: [
          'Fewer than 10 movements in a 2-hour dedicated counting window',
          'Sudden frenzy of violent movement followed by absolute cessation',
          'Absence of any fetal movement for more than 4 hours during active waking hours'
        ]
      }
    ]
  },
  {
    id: 'doc-who-postnatal',
    title: 'WHO Essential Postnatal Care & Maternal Recovery Guidelines',
    author: 'World Health Organization (WHO)',
    publisherOrSource: 'WHO Maternal & Newborn Health Department',
    editionYear: 2024,
    category: 'POSTNATAL_CARE',
    description: 'Comprehensive guidelines for the first six weeks postpartum, addressing lochia monitoring, perineal healing, exclusive breastfeeding, maternal mental health, and newborn danger signs.',
    estimatedReadMinutes: 40,
    language: 'English',
    tags: ['WHO', 'Postpartum', 'Lochia', 'Breastfeeding', 'Postnatal Depression'],
    isFeatured: true,
    chapters: [
      {
        id: 'who-ch1',
        chapterNumber: 1,
        title: 'Postpartum Physical Recovery, Lochia & Wound Care',
        content: 'The postpartum period encompasses the first six weeks following delivery. Normal vaginal discharge (lochia) evolves through three stages: Lochia rubra (dark red, lasting 3–4 days), Lochia serosa (pinkish-brown, lasting up to day 10), and Lochia alba (yellowish-white, lasting up to 3–4 weeks). Episiotomy or C-section wound care requires keeping the area clean and dry, hand hygiene before and after changing pads, and avoiding strenuous lifting for 6 weeks post-cesarean. Pelvic floor muscle exercises (Kegels) can be initiated gently once discomfort subsides.',
        keyTakeaways: [
          'Soaking more than one large sanitary pad within an hour is a warning sign of secondary postpartum hemorrhage.',
          'Foul-smelling discharge or fever indicates puerperal endometritis or wound infection.',
          'Sitz baths with warm saline promote perineal healing and relieve episiotomy soreness.'
        ],
        warningSigns: [
          'Sudden passage of blood clots larger than a lemon',
          'Fever >= 100.4°F (38°C) with chills',
          'Redness, purulent discharge, or wound dehiscence at C-section incision site',
          'Unilateral calf pain, swelling, or redness (deep vein thrombosis rule-out)'
        ]
      },
      {
        id: 'who-ch2',
        chapterNumber: 2,
        title: 'Successful Exclusive Breastfeeding & Mastitis Prevention',
        content: 'Initiation of breastfeeding within the first hour of birth (skin-to-skin golden hour) provides colostrum rich in secretory IgA and immune factors. Exclusive breastfeeding is recommended for the first six months. Proper latching—where baby\'s mouth covers a wide portion of the lower areola with flared lips—prevents nipple trauma. Nipple tenderness during the first week is common, but cracked or bleeding nipples indicate latch misalignment. Emptying breasts completely during feeds prevents milk stasis, the precursor to bacterial mastitis.',
        keyTakeaways: [
          'Colostrum is the baby\'s first immunization and should never be discarded.',
          'Feed on demand, typically 8 to 12 times in 24 hours for newborns.',
          'To relieve engorgement, apply warm compresses before feeding and cold compresses between feeds.'
        ],
        warningSigns: [
          'Hard, painful, red wedge-shaped area on breast accompanied by high fever and body aches (mastitis)',
          'Baby having fewer than 6 wet diapers per 24 hours after day 4',
          'Persistent infant lethargy or inability to wake for feeds'
        ]
      }
    ]
  },
  {
    id: 'doc-nhm-labour',
    title: 'NHM Guide to Stages of Labour & Normal Childbirth',
    author: 'National Health Mission (NHM), Ministry of Health & Family Welfare',
    publisherOrSource: 'Govt. of India Maternal Health Division',
    editionYear: 2023,
    category: 'LABOUR_AND_BIRTH',
    description: 'Practical clinical manual detailing true vs false labour, the four stages of delivery, pain relief techniques, partner support, and birth planning.',
    estimatedReadMinutes: 30,
    language: 'English',
    tags: ['NHM', 'Normal Delivery', 'Labour Stages', 'Pain Relief', 'Contractions'],
    chapters: [
      {
        id: 'nhm-ch1',
        chapterNumber: 1,
        title: 'Differentiating True Labour from Braxton Hicks Contractions',
        content: 'Braxton Hicks contractions are irregular, sporadic, do not increase in intensity, and usually subside with walking, rest, or hydration. True labour contractions occur at regular intervals, progressively shorten in interval (from every 15 minutes down to every 3-4 minutes), last 45 to 60 seconds, increase steadily in intensity, and do not cease with changes in posture. A "bloody show" (pink or blood-tinged mucus plug discharge) often precedes or accompanies early labour.',
        keyTakeaways: [
          'Use the 5-1-1 rule: Contractions every 5 minutes, lasting 1 minute each, consistently for 1 hour signify established active labour.',
          'Rupture of membranes ("water breaking") requires immediate hospital admission regardless of contraction presence.',
          'Deep rhythmic breathing and warm shower hydrotherapy help manage early labour discomfort.'
        ],
        warningSigns: [
          'Greenish or brown amniotic fluid (meconium staining)',
          'Continuous severe uterine tenderness between contractions (placental abruption)',
          'Bright red active bleeding per vaginum'
        ]
      }
    ]
  },
  {
    id: 'doc-gynec-pcos',
    title: 'Clinical Care Handbook for PCOS & Menstrual Health',
    author: 'Dr. Anita Rao, MD (OB-GYN) & Continuum Editorial Board',
    publisherOrSource: 'Continuum Women\'s Health Publishing',
    editionYear: 2024,
    category: 'GYNECOLOGY',
    description: 'Evidence-based guidance on polycystic ovarian syndrome (PCOS), oligomenorrhea, hormonal balancing, insulin resistance, and lifestyle medicine.',
    estimatedReadMinutes: 25,
    language: 'English',
    tags: ['PCOS', 'Menstrual Cycle', 'Inositol', 'Insulin Resistance', 'Hormones'],
    chapters: [
      {
        id: 'pcos-ch1',
        chapterNumber: 1,
        title: 'Understanding PCOS Phenotypes & Hormonal Regulation',
        content: 'PCOS is diagnosed using the Rotterdam Criteria (requiring at least two of: ovulatory dysfunction, hyperandrogenism, or polycystic ovaries on ultrasound). Core pathophysiology frequently involves hyperinsulinemia stimulating ovarian theca cell androgen synthesis. First-line therapy focuses on sustained lifestyle interventions: resistance training to upregulate GLUT-4 receptors, low-glycemic Mediterranean dietary patterns, and correcting vitamin D3 deficiency. Supplements like Myo-Inositol (40:1 ratio with D-chiro-inositol) support ovulation regularity.',
        keyTakeaways: [
          'A 5–10% reduction in body weight often restores spontaneous ovulatory cycles.',
          'PCOS is a metabolic-endocrine condition, not solely an ovarian disease.',
          'Regular annual screening for glucose intolerance and lipid abnormalities is advised.'
        ],
        warningSigns: [
          'Prolonged continuous vaginal bleeding exceeding 14 days',
          'Severe acute pelvic pain (ovarian cyst torsion risk)',
          'Absence of menses for > 3 months in non-pregnant women (endometrial hyperplasia check)'
        ]
      }
    ]
  }
];

export const KNOWLEDGE_VIDEOS: KnowledgeVideoResource[] = [
  {
    id: 'vid-1',
    title: 'Recognising High-Risk Symptoms: When to Visit Emergency vs Tele-Counselling',
    speaker: 'Dr. Anita Rao',
    speakerDesignation: 'Senior Consultant Obstetrician & Gynaecologist, Hubballi District Hospital',
    durationMinutes: 6,
    category: 'HIGH_RISK_AWARENESS',
    videoUrl: 'https://cdn.continuumcare.in/videos/emergency_symptoms_guide.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=60',
    transcript: 'Welcome mothers and families. In this brief video, I want to clarify when you should book an online 5-minute tele-counselling session versus when you must immediately proceed to our 24/7 hospital emergency triage. Online counselling is ideal for clarifying medication schedules, understanding minor nausea, reviewing lab test dates, or asking about normal pelvic stretching. However, if you experience: sudden bright red bleeding, fluid gushing from your vagina, severe upper abdominal pain, a blinding headache with flashing lights, or a sharp drop in your baby\'s kicks—do NOT wait for a tele-call. Call 108 or have your family drive you directly to Casualty at District Hospital Hubballi. Our emergency obstetric OT is staffed around the clock.',
    keyLessons: [
      'Tele-counselling is for non-critical questions, routine doubt clearance, and report discussions.',
      'Active bleeding, reduced movements, and severe preeclampsia symptoms require physical emergency evaluation immediately.'
    ]
  },
  {
    id: 'vid-2',
    title: 'Preparing for Normal Delivery: Pelvic Positioning & Breathing Techniques',
    speaker: 'Dr. Sunita Deshmukh',
    speakerDesignation: 'Associate Professor & Obstetrician, District Hospital',
    durationMinutes: 8,
    category: 'LABOUR_AND_BIRTH',
    videoUrl: 'https://cdn.continuumcare.in/videos/normal_delivery_prep.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=60',
    transcript: 'Preparing your body and mind for childbirth involves three core practices: upright mobility during early labour, targeted diaphragmatic breathing, and trusting your body\'s natural physiology. Walking and swaying on a birth ball helps baby\'s head engage into the pelvis in the optimal occiput-anterior position. During contractions, avoid holding your breath or tensing your shoulders. Instead, take a slow deep inhale through your nose for 4 counts, and exhale gently through parted lips for 6 counts, releasing tension down into your pelvic floor.',
    keyLessons: [
      'Remaining upright and moving accelerates cervical effacement and dilation.',
      'Rhythmic slow breathing reduces cortisol and enhances natural oxytocin surges.'
    ]
  },
  {
    id: 'vid-3',
    title: 'Newborn Care Essentials: Golden Hour, Feeding & Jaundice Signs',
    speaker: 'Dr. Ramesh Kulkarni',
    speakerDesignation: 'Senior Neonatologist & Pediatrician',
    durationMinutes: 7,
    category: 'NEWBORN_CARE',
    videoUrl: 'https://cdn.continuumcare.in/videos/newborn_first_week.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&auto=format&fit=crop&q=60',
    transcript: 'The first week of life is a precious transitional phase for your baby. We recommend uninterrupted skin-to-skin contact right after birth. Feed your newborn on demand, looking for early hunger cues like root reflexes and hand-to-mouth sucking rather than waiting for vigorous crying. Watch for neonatal jaundice: while mild yellowish tinge on face by day 3 is common physiological jaundice, if the yellowness extends down past the chest to the palms and soles, or if baby appears excessively lethargic and feeds poorly, bring baby in immediately for transcutaneous bilirubin testing.',
    keyLessons: [
      'Skin-to-skin contact stabilizes newborn body temperature, blood sugar, and bonding.',
      'Monitor wet diapers: at least 6 heavy wet diapers per day from day 4 onwards confirms adequate milk intake.'
    ]
  }
];

class KnowledgeLibraryService {
  private documents: KnowledgeDocument[] = KNOWLEDGE_DOCUMENTS;
  private videos: KnowledgeVideoResource[] = KNOWLEDGE_VIDEOS;

  getAllDocuments(): KnowledgeDocument[] {
    return this.documents;
  }

  getDocumentsByCategory(category: KnowledgeCategory): KnowledgeDocument[] {
    return this.documents.filter(d => d.category === category);
  }

  getDocumentById(id: string): KnowledgeDocument | undefined {
    return this.documents.find(d => d.id === id);
  }

  getAllVideos(): KnowledgeVideoResource[] {
    return this.videos;
  }

  getVideosByCategory(category: KnowledgeCategory): KnowledgeVideoResource[] {
    return this.videos.filter(v => v.category === category);
  }

  searchContent(query: string): { documents: KnowledgeDocument[]; videos: KnowledgeVideoResource[] } {
    const q = query.toLowerCase().trim();
    if (!q) return { documents: this.documents, videos: this.videos };

    const docs = this.documents.filter(d => 
      d.title.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q)) ||
      d.chapters.some(c => c.title.toLowerCase().includes(q) || c.content.toLowerCase().includes(q))
    );

    const vids = this.videos.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.transcript.toLowerCase().includes(q) ||
      v.speaker.toLowerCase().includes(q)
    );

    return { documents: docs, videos: vids };
  }

  // Helper for RAG Retrieval: finds the top matching excerpts and citations
  retrieveRelevantSnippets(query: string, maxSnippets: number = 3): RagCitation[] {
    const q = query.toLowerCase();
    const snippets: RagCitation[] = [];

    // Search chapters
    for (const doc of this.documents) {
      for (const ch of doc.chapters) {
        let matchScore = 0;
        const words = q.split(/\s+/).filter(w => w.length > 3);
        for (const w of words) {
          if (ch.title.toLowerCase().includes(w)) matchScore += 3;
          if (ch.content.toLowerCase().includes(w)) matchScore += 1;
          if (ch.keyTakeaways.some(k => k.toLowerCase().includes(w))) matchScore += 2;
        }

        if (matchScore > 0 || snippets.length < maxSnippets) {
          const excerpt = ch.content.length > 280 ? ch.content.slice(0, 280) + '...' : ch.content;
          snippets.push({
            sourceTitle: doc.title,
            chapterOrSection: `Ch. ${ch.chapterNumber}: ${ch.title}`,
            pageNumber: ch.chapterNumber * 14 + 5,
            confidence: Math.min(98, 70 + matchScore * 5),
            excerpt
          });
        }
      }
    }

    return snippets.slice(0, maxSnippets);
  }
}

export const knowledgeLibraryService = new KnowledgeLibraryService();
