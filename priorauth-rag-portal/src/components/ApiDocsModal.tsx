import React from 'react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-space-md animate-in fade-in">
      <div className="bg-surface-container-lowest max-w-3xl w-full rounded-2xl shadow-2xl p-space-lg flex flex-col gap-space-md max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">api</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                PriorAuth RAG Engine API Specification
              </h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                HIPAA Tier 4 REST Endpoints • OpenAPI 3.1 • FHIR / HL7 Da Vinci PAS Compatible
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-space-xs flex flex-col gap-space-md font-body-sm text-body-sm text-on-surface">
          <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs">
            <span className="font-label-md text-label-md text-primary font-bold">Base URL</span>
            <code className="font-code-sm text-code-sm bg-surface-container-lowest px-space-sm py-1 rounded border border-surface-container-high text-on-surface">
              https://api.priorauth-rag.health/v1
            </code>
            <span className="text-outline text-label-sm">
              Authentication: Bearer JWT Token with clinical reviewer claims (NPI verification required)
            </span>
          </div>

          <div className="flex flex-col gap-space-xs">
            <span className="font-label-md text-label-md text-on-surface font-bold">Key Endpoints</span>

            {/* Endpoint 1 */}
            <div className="border border-surface-container rounded-xl p-space-md flex flex-col gap-space-2xs bg-surface-container-lowest">
              <div className="flex items-center gap-space-xs">
                <span className="px-space-xs py-0.5 rounded bg-primary text-on-primary font-code-sm text-code-sm font-bold">POST</span>
                <span className="font-code-sm text-code-sm font-bold text-on-surface">/api/v1/rag-eval</span>
                <span className="ml-auto text-secondary font-semibold font-label-sm">Real-time Determination</span>
              </div>
              <p className="text-on-surface-variant text-body-sm mt-1">
                Submits structured patient EHR clinical records and CPT codes for multi-stage TOC routing, vector retrieval, and deterministic guideline matching.
              </p>
              <div className="bg-inverse-surface text-inverse-on-surface p-space-sm rounded-lg font-code-sm text-code-sm mt-1 overflow-x-auto">
                <pre>{`curl -X POST https://api.priorauth-rag.health/v1/rag-eval \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "cpt_code": "22551",
    "patient_mrn": "***-4910",
    "payer_id": "CIGNA_COMMERCIAL",
    "clinical_text": "ACDF revision evaluation with persistent radiculopathy"
  }'`}</pre>
              </div>
            </div>

            {/* Endpoint 2 */}
            <div className="border border-surface-container rounded-xl p-space-md flex flex-col gap-space-2xs bg-surface-container-lowest">
              <div className="flex items-center gap-space-xs">
                <span className="px-space-xs py-0.5 rounded bg-secondary text-on-secondary font-code-sm text-code-sm font-bold">GET</span>
                <span className="font-code-sm text-code-sm font-bold text-on-surface">/api/v1/policies/:policy_id/toc</span>
                <span className="ml-auto text-outline font-semibold font-label-sm">Ontology Traversal</span>
              </div>
              <p className="text-on-surface-variant text-body-sm mt-1">
                Returns the hierarchical Table of Contents vector chunks and Boolean decision rules for a specified payer coverage bulletin.
              </p>
            </div>

            {/* Endpoint 3 */}
            <div className="border border-surface-container rounded-xl p-space-md flex flex-col gap-space-2xs bg-surface-container-lowest">
              <div className="flex items-center gap-space-xs">
                <span className="px-space-xs py-0.5 rounded bg-primary-container text-on-primary-container font-code-sm text-code-sm font-bold">POST</span>
                <span className="font-code-sm text-code-sm font-bold text-on-surface">/api/v1/audit/attest</span>
                <span className="ml-auto text-secondary font-semibold font-label-sm">HIPAA Tier 4 Ledger</span>
              </div>
              <p className="text-on-surface-variant text-body-sm mt-1">
                Appends physician cryptographic digital signature and clinical attestation to the immutable SHA-256 Merkle ledger.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-surface-container pt-space-sm">
          <span className="text-outline text-label-sm">Status: 99.98% Gateway Uptime</span>
          <button
            onClick={onClose}
            className="px-space-lg py-space-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
