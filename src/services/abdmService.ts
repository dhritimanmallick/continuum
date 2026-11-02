/**
 * ABDM (Ayushman Bharat Digital Mission) & NRCeS India FHIR Integration Abstraction
 * Continuum functions as a Health Repository Provider (HRP) / Health Information Provider (HIP).
 */

export interface ABHAPatientProfile {
  abhaNumber: string; // 14 digits (e.g. "91-8842-1049-2311")
  abhaAddress: string; // e.g. "sunita.devi@abdm"
  name: string;
  gender: 'female' | 'male' | 'other';
  dob: string;
  mobile: string;
  state: string;
  district: string;
  pincode: string;
  verified: boolean;
  kycStatus: 'VERIFIED' | 'PENDING';
}

export interface FHIRResourceBundle {
  resourceType: 'Bundle';
  type: 'collection';
  timestamp: string;
  entry: Array<{
    fullUrl: string;
    resource: Record<string, unknown>;
  }>;
}

export interface IABDMService {
  generateOtpForAadhaar(aadhaarNumber: string): Promise<{ txnId: string; message: string }>;
  verifyOtpAndCreateAbha(txnId: string, otp: string, desiredAddress: string): Promise<ABHAPatientProfile>;
  lookupPatientByAbha(abhaNumberOrAddress: string): Promise<ABHAPatientProfile | null>;
  generateFHIRBundleForPregnancy(pregnancyId: string, patientData: Record<string, unknown>): FHIRResourceBundle;
  generateFHIRDiagnosticReportBundle(params: {
    patientId: string;
    patientName: string;
    abhaNumber?: string;
    abhaAddress?: string;
    orderId: string;
    testName: string;
    category?: string;
    summaryText: string;
    findings?: string;
    parameters?: Array<{
      name: string;
      value: string;
      numericValue?: number;
      unit: string;
      referenceRange: string;
      status: string;
      loincCode?: string;
    }>;
    doctorName?: string;
    labName?: string;
  }): FHIRResourceBundle;
  uploadDiagnosticReportToABDM(params: {
    patientId: string;
    patientName: string;
    abhaNumber?: string;
    abhaAddress?: string;
    orderId: string;
    testName: string;
    category?: string;
    summaryText: string;
    findings?: string;
    parameters?: Array<{
      name: string;
      value: string;
      numericValue?: number;
      unit: string;
      referenceRange: string;
      status: string;
      loincCode?: string;
    }>;
    doctorName?: string;
    labName?: string;
  }): Promise<{
    success: boolean;
    txnId: string;
    careContextId: string;
    hipId: string;
    timestamp: string;
    fhirBundle: FHIRResourceBundle;
    qrPayload: string;
  }>;
}

export class MockABDMService implements IABDMService {
  private registeredProfiles: Map<string, ABHAPatientProfile> = new Map();

  constructor() {
    // Pre-seed known demo ABHA records
    this.registeredProfiles.set('91-8842-1049-2311', {
      abhaNumber: '91-8842-1049-2311',
      abhaAddress: 'sunita.devi@abdm',
      name: 'Sunita D.',
      gender: 'female',
      dob: '1998-04-12',
      mobile: '+91 98452 11029',
      state: 'Karnataka',
      district: 'Dharwad',
      pincode: '580020',
      verified: true,
      kycStatus: 'VERIFIED'
    });

    this.registeredProfiles.set('91-7721-3948-1102', {
      abhaNumber: '91-7721-3948-1102',
      abhaAddress: 'meena.r@abdm',
      name: 'Meena R.',
      gender: 'female',
      dob: '2001-09-24',
      mobile: '+91 98860 44219',
      state: 'Karnataka',
      district: 'Dharwad',
      pincode: '580024',
      verified: true,
      kycStatus: 'VERIFIED'
    });
  }

  async generateOtpForAadhaar(aadhaarNumber: string): Promise<{ txnId: string; message: string }> {
    const masked = aadhaarNumber.slice(-4).padStart(12, 'X');
    const txnId = `ABDM-TXN-${Date.now()}`;
    return {
      txnId,
      message: `OTP sent successfully to Aadhaar-registered mobile ending with ${masked.slice(-4)}. Valid for 10 minutes.`
    };
  }

  async verifyOtpAndCreateAbha(txnId: string, otp: string, desiredAddress: string): Promise<ABHAPatientProfile> {
    const random14Digits = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const address = desiredAddress.includes('@') ? desiredAddress : `${desiredAddress.toLowerCase().replace(/\s+/g, '.')}@abdm`;

    const profile: ABHAPatientProfile = {
      abhaNumber: random14Digits,
      abhaAddress: address,
      name: 'Verified Enrollee',
      gender: 'female',
      dob: '1999-01-01',
      mobile: '+91 98450 00000',
      state: 'Karnataka',
      district: 'Dharwad',
      pincode: '580001',
      verified: true,
      kycStatus: 'VERIFIED'
    };

    this.registeredProfiles.set(profile.abhaNumber, profile);
    this.registeredProfiles.set(profile.abhaAddress, profile);
    return profile;
  }

  async lookupPatientByAbha(abhaNumberOrAddress: string): Promise<ABHAPatientProfile | null> {
    const cleanKey = abhaNumberOrAddress.trim();
    if (this.registeredProfiles.has(cleanKey)) {
      return this.registeredProfiles.get(cleanKey)!;
    }
    for (const val of this.registeredProfiles.values()) {
      if (val.abhaNumber === cleanKey || val.abhaAddress.toLowerCase() === cleanKey.toLowerCase()) {
        return val;
      }
    }
    return null;
  }

  generateFHIRBundleForPregnancy(pregnancyId: string, patientData: Record<string, unknown>): FHIRResourceBundle {
    const timestamp = new Date().toISOString();
    return {
      resourceType: 'Bundle',
      type: 'collection',
      timestamp,
      entry: [
        {
          fullUrl: `urn:uuid:patient-${patientData.id || 'pat'}`,
          resource: {
            resourceType: 'Patient',
            id: String(patientData.id || 'pat'),
            meta: {
              profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/Patient']
            },
            identifier: [
              {
                type: { coding: [{ system: 'https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code', code: 'ABHA' }] },
                value: String(patientData.abhaNumber || '')
              }
            ],
            name: [{ text: String(patientData.name || '') }],
            telecom: [{ system: 'phone', value: String(patientData.mobile || '') }],
            gender: patientData.gender || 'female'
          }
        },
        {
          fullUrl: `urn:uuid:episode-${pregnancyId}`,
          resource: {
            resourceType: 'EpisodeOfCare',
            id: pregnancyId,
            status: 'active',
            type: [{ coding: [{ system: 'http://snomed.info/sct', code: '77386006', display: 'Pregnancy' }] }],
            period: { start: timestamp.slice(0, 10) }
          }
        }
      ]
    };
  }

  generateFHIRDiagnosticReportBundle(params: {
    patientId: string;
    patientName: string;
    abhaNumber?: string;
    abhaAddress?: string;
    orderId: string;
    testName: string;
    category?: string;
    summaryText: string;
    findings?: string;
    parameters?: Array<{
      name: string;
      value: string;
      numericValue?: number;
      unit: string;
      referenceRange: string;
      status: string;
      loincCode?: string;
    }>;
    doctorName?: string;
    labName?: string;
  }): FHIRResourceBundle {
    const timestamp = new Date().toISOString();
    const effectiveDate = timestamp.slice(0, 10);
    const patientUuid = `patient-${params.patientId || 'pat'}`;
    const reportUuid = `diag-report-${params.orderId}`;
    const orgUuid = 'org-continuum-hip-0042';
    const practUuid = 'pract-ramesh-kulkarni';

    const observationEntries = (params.parameters || []).map((param, idx) => {
      const obsUuid = `obs-${params.orderId}-${idx + 1}`;
      const loinc = param.loincCode || (
        param.name.toLowerCase().includes('glucose') ? '1558-6' :
        param.name.toLowerCase().includes('hemoglobin') || param.name.toLowerCase().includes('hb') ? '718-7' :
        param.name.toLowerCase().includes('platelet') ? '777-3' :
        param.name.toLowerCase().includes('tsh') ? '3016-3' :
        param.name.toLowerCase().includes('protein') ? '2888-6' : '30954-2'
      );

      return {
        fullUrl: `urn:uuid:${obsUuid}`,
        resource: {
          resourceType: 'Observation',
          id: obsUuid,
          meta: {
            profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/Observation']
          },
          status: 'final',
          category: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                  code: 'laboratory',
                  display: 'Laboratory'
                }
              ]
            }
          ],
          code: {
            coding: [
              {
                system: 'http://loinc.org',
                code: loinc,
                display: param.name
              }
            ],
            text: param.name
          },
          subject: {
            reference: `urn:uuid:${patientUuid}`,
            display: params.patientName
          },
          effectiveDateTime: timestamp,
          valueQuantity: param.numericValue !== undefined ? {
            value: param.numericValue,
            unit: param.unit,
            system: 'http://unitsofmeasure.org',
            code: param.unit
          } : undefined,
          valueString: param.numericValue === undefined ? param.value : undefined,
          interpretation: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
                  code: param.status === 'HIGH' ? 'H' : param.status === 'LOW' ? 'L' : param.status === 'CRITICAL' ? 'AA' : 'N',
                  display: param.status
                }
              ],
              text: param.status
            }
          ],
          referenceRange: [
            {
              text: param.referenceRange
            }
          ]
        }
      };
    });

    return {
      resourceType: 'Bundle',
      type: 'collection',
      timestamp,
      entry: [
        // 1. Patient Resource
        {
          fullUrl: `urn:uuid:${patientUuid}`,
          resource: {
            resourceType: 'Patient',
            id: patientUuid,
            meta: {
              profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/Patient']
            },
            identifier: [
              {
                type: {
                  coding: [
                    {
                      system: 'https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code',
                      code: 'ABHA',
                      display: 'Ayushman Bharat Health Account'
                    }
                  ]
                },
                system: 'https://healthid.ndhm.gov.in',
                value: params.abhaNumber || '91-8842-1049-2311'
              },
              {
                type: {
                  coding: [
                    {
                      system: 'https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code',
                      code: 'ABHA_ADDRESS',
                      display: 'ABHA Address'
                    }
                  ]
                },
                value: params.abhaAddress || `${params.patientName.toLowerCase().replace(/\s+/g, '.')}@abdm`
              }
            ],
            name: [{ text: params.patientName }],
            gender: 'female'
          }
        },
        // 2. Organization (Diagnostic HIP)
        {
          fullUrl: `urn:uuid:${orgUuid}`,
          resource: {
            resourceType: 'Organization',
            id: orgUuid,
            meta: {
              profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/Organization']
            },
            identifier: [
              {
                system: 'https://facility.ndhm.gov.in',
                value: 'IN-KA-DH-HOSP-0042'
              }
            ],
            name: params.labName || 'Continuum Apex Diagnostic Lab & Pathology Center'
          }
        },
        // 3. Practitioner (Reporting Pathologist)
        {
          fullUrl: `urn:uuid:${practUuid}`,
          resource: {
            resourceType: 'Practitioner',
            id: practUuid,
            meta: {
              profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/Practitioner']
            },
            identifier: [
              {
                system: 'https://doctor.ndhm.gov.in',
                value: 'KMC-REG-64821'
              }
            ],
            name: [{ text: 'Dr. Ramesh Kulkarni, MD (Pathology)' }]
          }
        },
        // 4. DiagnosticReport Resource
        {
          fullUrl: `urn:uuid:${reportUuid}`,
          resource: {
            resourceType: 'DiagnosticReport',
            id: reportUuid,
            meta: {
              profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/DiagnosticReport']
            },
            identifier: [
              {
                system: 'https://continuum.health/lab-orders',
                value: params.orderId
              }
            ],
            status: 'final',
            category: [
              {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                    code: 'LAB',
                    display: 'Laboratory'
                  }
                ]
              }
            ],
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '11502-2',
                  display: params.testName
                }
              ],
              text: params.testName
            },
            subject: {
              reference: `urn:uuid:${patientUuid}`,
              display: params.patientName
            },
            effectiveDateTime: timestamp,
            issued: timestamp,
            performer: [
              {
                reference: `urn:uuid:${practUuid}`,
                display: 'Dr. Ramesh Kulkarni, MD'
              },
              {
                reference: `urn:uuid:${orgUuid}`,
                display: params.labName || 'Apex Diagnostic Lab'
              }
            ],
            result: observationEntries.map(e => ({
              reference: e.fullUrl,
              display: (e.resource as any).code?.text
            })),
            conclusion: `${params.summaryText}${params.findings ? `. Comments: ${params.findings}` : ''}`
          }
        },
        // Observations
        ...observationEntries
      ]
    };
  }

  async uploadDiagnosticReportToABDM(params: {
    patientId: string;
    patientName: string;
    abhaNumber?: string;
    abhaAddress?: string;
    orderId: string;
    testName: string;
    category?: string;
    summaryText: string;
    findings?: string;
    parameters?: Array<{
      name: string;
      value: string;
      numericValue?: number;
      unit: string;
      referenceRange: string;
      status: string;
      loincCode?: string;
    }>;
    doctorName?: string;
    labName?: string;
  }): Promise<{
    success: boolean;
    txnId: string;
    careContextId: string;
    hipId: string;
    timestamp: string;
    fhirBundle: FHIRResourceBundle;
    qrPayload: string;
  }> {
    // Generate valid NRCeS FHIR R4 Bundle
    const fhirBundle = this.generateFHIRDiagnosticReportBundle(params);
    const timestamp = new Date().toISOString();
    const txnId = `ABDM-TXN-LAB-${Math.floor(100000 + Math.random() * 900000)}`;
    const careContextId = `CC-LAB-${params.orderId}`;
    const hipId = 'IN-KA-DH-HOSP-0042';

    const qrPayload = JSON.stringify({
      schema: 'ABDM-M3-DIAGNOSTIC-REPORT',
      hip: hipId,
      careContext: careContextId,
      abha: params.abhaAddress || `${params.patientName.toLowerCase().replace(/\s+/g, '.')}@abdm`,
      txn: txnId,
      test: params.testName,
      issued: timestamp.slice(0, 10),
      signature: 'SHA256-DIGITALLY-SIGNED-BY-PATHOLOGIST-RAMESH'
    });

    return {
      success: true,
      txnId,
      careContextId,
      hipId,
      timestamp,
      fhirBundle,
      qrPayload
    };
  }
}

export const abdmService: IABDMService = new MockABDMService();
