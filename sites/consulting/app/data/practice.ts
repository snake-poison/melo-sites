export const practice = {
  name: 'Property Claims Consulting',
  url: 'https://propertyclaimsconsulting.net',
  email: 'info@propertyclaimsconsulting.net',
  phone: '704-305-2338',
  phoneHref: 'tel:+17043052338',
  firmUrl: 'https://melopropertyclaimsadjusting.com',
}

export const services = [
  {
    slug: 'insurance-appraisal',
    prompt: 'I need an appraiser for a loss dispute',
    name: 'Insurance appraisal',
    short: 'For disputes over the amount of loss',
    icon: 'document',
    title: 'Property insurance appraisal in North Carolina',
    description: 'Property insurance appraisal for disputes over repair scope, pricing, and the amount of loss. Discuss an appraisal assignment with Property Claims Consulting.',
    intro: 'When the amount of a property loss is disputed, appraisal may provide a way to address the differences. We review the property damage, estimates, and supporting records within the scope of the assignment.',
    audience: 'For parties seeking a property insurance appraiser',
    card: 'A closer look at the damage, repair scope, and valuation behind a disputed property insurance claim.',
    work: [
      { title: 'Establish the disputed items', text: 'Identify where estimates differ in scope, quantities, repair methods, or pricing.' },
      { title: 'Evaluate the supporting record', text: 'Consider photographs, estimates, inspection findings, and other documents relevant to the amount of loss.' },
      { title: 'Participate in the appraisal process', text: 'Present and discuss the valuation with the other appraiser within the applicable appraisal framework.' },
    ],
    scope: 'Appraisal commonly addresses the amount of loss. The policy and applicable law determine the process and its limits; appraisal does not automatically resolve every coverage question.',
    questions: [
      { question: 'Is this a real estate appraisal?', answer: 'This service concerns property insurance losses and the amount of damage. It is different from a market-value appraisal for a mortgage, sale, or tax assessment.' },
      { question: 'What should I provide initially?', answer: 'Start with the property location, parties, loss type, and a summary of the disputed items. Policy provisions, estimates, and supporting records can be requested after the initial review.' },
    ],
  },
  {
    slug: 'umpire-services',
    prompt: 'Our appraisal panel needs an umpire',
    name: 'Umpire services',
    short: 'For appraisal panels',
    icon: 'scales',
    title: 'Property insurance appraisal umpire services',
    description: 'Umpire services for property insurance appraisal disputes in North Carolina. Inquire about appointment, availability, and assignment review.',
    intro: 'When the two appraisers cannot agree on disputed loss items, an umpire brings an impartial review to the appraisal panel. The work centers on the evidence and the issues submitted for determination.',
    audience: 'For appraisers and parties considering an umpire appointment',
    card: 'Impartial consideration of the differences between appraisers, with attention to the evidence and the assignment’s scope.',
    work: [
      { title: 'Review the appointment', text: 'Discuss the proposed role, parties, prior involvement, and potential conflicts before accepting the assignment.' },
      { title: 'Consider both appraisers’ positions', text: 'Review estimates and supporting documentation to understand the points of agreement and disagreement.' },
      { title: 'Address the submitted differences', text: 'Evaluate the disputed issues within the policy’s appraisal framework and document the determination.' },
    ],
    scope: 'An umpire serves an impartial role. Availability, suitability, fees, and appointment requirements are addressed before engagement. Prior involvement must be disclosed and considered.',
    questions: [
      { question: 'How is an umpire different from an appraiser?', answer: 'Each party selects an appraiser under the policy’s appraisal provision. The umpire is the impartial member of the panel who considers differences the appraisers cannot resolve. The precise requirements depend on the policy and applicable law.' },
      { question: 'Can you accept an assignment if you have prior involvement?', answer: 'Any prior relationship or involvement needs to be disclosed for conflict review. An inquiry is not acceptance of an appointment, and prior involvement may prevent acceptance.' },
    ],
  },
  {
    slug: 'claims-consulting',
    prompt: 'I have questions about a claim file',
    name: 'Claims consulting',
    short: 'For property owners and professionals',
    icon: 'search',
    title: 'Property insurance claims consulting',
    description: 'Property claims consulting in North Carolina: claim documentation, estimate review, and damage scope analysis. Discuss the questions in your claim file.',
    intro: 'A property claim can involve multiple estimates, reports, photographs, and unanswered questions. We help organize the record and examine the scope and valuation issues that need a closer look.',
    audience: 'For property owners, attorneys, and property professionals',
    card: 'Focused review of the claim file, damage documentation, and estimate differences so the next step is easier to understand.',
    work: [
      { title: 'Understand the question', text: 'Define the issue you need examined and the documents available to support the review.' },
      { title: 'Review scope and estimates', text: 'Compare the information behind the numbers, including damage descriptions, repair assumptions, and supporting records.' },
      { title: 'Explain the findings', text: 'Identify material differences, missing information, and questions that need further investigation.' },
    ],
    scope: 'The consulting scope is agreed for each engagement. A consulting engagement does not automatically include representation or negotiation of a claim.',
    questions: [
      { question: 'Does consulting include negotiating my claim?', answer: 'Representation and negotiation are public-adjusting services. A consulting engagement defines the particular review or analysis requested; it does not automatically include claim representation.' },
      { question: 'Do I need a complete claim file to inquire?', answer: 'No. Describe your question and what information you have. We can discuss which documents are needed for the proposed review before you send sensitive material.' },
    ],
  },
  {
    slug: 'expert-witness',
    prompt: 'I’m counsel seeking an expert',
    name: 'Expert witness',
    short: 'For attorneys and litigation teams',
    icon: 'people',
    title: 'Property insurance expert witness services',
    description: 'Property insurance expert witness and litigation consulting inquiries in North Carolina. Discuss property damage, repair scope, and valuation issues.',
    intro: 'Property insurance disputes can turn on how damage was documented, repairs were scoped, and loss amounts were evaluated. We work with counsel to define the property-claims questions that need expert analysis.',
    audience: 'For attorneys seeking property-claims analysis',
    card: 'Property-claims analysis for counsel, with opinions and testimony limited to the practitioner’s qualifications and the engagement.',
    work: [
      { title: 'Review the proposed subject matter', text: 'Discuss the questions, parties, deadlines, and expertise needed to determine whether the assignment is a fit.' },
      { title: 'Analyze the claim evidence', text: 'Examine relevant claim records, damage documentation, estimates, and valuation methods within the agreed scope.' },
      { title: 'Define the expert deliverables', text: 'Agree with counsel on the requested analysis, reporting, and any deposition or trial testimony before engagement.' },
    ],
    scope: 'Consulting and testifying roles are defined separately. Expert opinions are limited to supported findings within the practitioner’s qualifications. An inquiry does not establish court qualification or acceptance of an assignment.',
    questions: [
      { question: 'Can counsel request qualifications before engaging?', answer: 'Yes. Include the subject matter and requested role so relevant background and qualifications can be discussed before engagement.' },
      { question: 'Is expert work the same as serving as an umpire?', answer: 'No. Litigation consulting or expert testimony is a separate engagement from an impartial umpire appointment. The role and any prior involvement must be reviewed before acceptance.' },
    ],
  },
]

export function inquiryHref(service = 'Assignment') {
  return `mailto:${practice.email}?subject=${encodeURIComponent(`Property Claims Consulting — ${service} inquiry`)}`
}
