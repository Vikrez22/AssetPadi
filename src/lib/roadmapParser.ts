import { Roadmap, UserProfile, Message } from '../types';

const COMMON_ASSETS = [
  'sewing machine',
  'generator',
  'tools',
  'machinery',
  'equipment',
  'vehicle',
  'car',
  'truck',
  'motorcycle',
  'inventory',
  'stock',
  'livestock',
  'cows',
  'chickens',
  'goats',
  'camera',
  'computer',
  'laptop',
  'oven',
  'refrigerator',
  'clipper',
  'hairdryer',
  'grinder',
  'mill'
];

export function parseRoadmapFromResponse(
  aiResponse: string,
  user: UserProfile,
  allMessages: Message[]
): Roadmap | null {
  if (!aiResponse.includes('[GENERATE_ROADMAP]')) return null;

  // Extract qualifying assets mentioned in the conversation
  const contextText = [...allMessages.map(m => m.content), aiResponse].join(' ').toLowerCase();
  const qualifyingAssets: string[] = [];
  
  COMMON_ASSETS.forEach(asset => {
    if (contextText.includes(asset) && !qualifyingAssets.includes(asset)) {
      // Capitalize first letter for display
      qualifyingAssets.push(asset.charAt(0).toUpperCase() + asset.slice(1));
    }
  });

  // If none detected, provide a default based on business type
  if (qualifyingAssets.length === 0) {
    if (user.businessType.toLowerCase().includes('shoemaker') || user.businessType.toLowerCase().includes('cobbler')) {
      qualifyingAssets.push('Shoemaking Tools & Machinery', 'Raw Leather Materials');
    } else if (user.businessType.toLowerCase().includes('tailor') || user.businessType.toLowerCase().includes('fashion')) {
      qualifyingAssets.push('Sewing Machine', 'Fabric Inventory');
    } else if (user.businessType.toLowerCase().includes('food') || user.businessType.toLowerCase().includes('vendor')) {
      qualifyingAssets.push('Cooking Equipment', 'Generator');
    } else {
      qualifyingAssets.push('Business Tools & Equipment');
    }
  }

  // Generate localized step description
  const cacDesc = user.language === 'pidgin'
    ? `Register your business name with Corporate Affairs Commission (CAC). As a ${user.businessType} for ${user.location}, this will cost around ₦10,000–₦15,000 and take 2–5 days online. Your business name will be official!`
    : `Register your business name with the Corporate Affairs Commission (CAC). As a ${user.businessType} in ${user.location}, this costs approximately ₦10,000–₦15,000 and takes 2–5 working days online.`;

  const assetsText = qualifyingAssets.join(', ');
  const ncrDesc = user.language === 'pidgin'
    ? `Carry your CAC certificate and register your assets (${assetsText}) on top National Collateral Registry (NCR). This will turn your tools into recognized collateral so banks can value them.`
    : `Once you have your CAC certificate, register your movable assets (${assetsText}) on the National Collateral Registry (NCR). This turns your assets into recognized collateral for business loans.`;

  const loanDesc = user.language === 'pidgin'
    ? `With your CAC paper and NCR register, go meet Microfinance banks or check Central Bank (CBN) MSME funds for credit. Your registered tools (${assetsText}) stand as security for the loan!`
    : `With your CAC certificate and NCR registration, approach microfinance banks or commercial banks to apply for an asset-backed business loan. Your registered assets (${assetsText}) will serve as security.`;

  const roadmap: Roadmap = {
    generatedAt: new Date(),
    userProfile: user,
    qualifyingAssets,
    steps: [
      {
        id: 1,
        title: user.language === 'pidgin' ? 'Register Your Business Name for CAC' : 'Register Your Business Name',
        description: cacDesc,
        institution: 'Corporate Affairs Commission (CAC)',
        institutionUrl: 'https://cac.gov.ng',
        estimatedCost: '₦10,000 – ₦15,000',
        estimatedTime: '2–5 working days',
        completed: false,
      },
      {
        id: 2,
        title: user.language === 'pidgin' ? 'Register Your Assets on top NCR' : 'Register Your Assets on the NCR',
        description: ncrDesc,
        institution: 'National Collateral Registry (NCR)',
        institutionUrl: 'https://ncr.gov.ng',
        estimatedCost: 'Free / Low fee',
        estimatedTime: '1–3 working days',
        completed: false,
      },
      {
        id: 3,
        title: user.language === 'pidgin' ? 'Apply for Business Loan' : 'Apply for a Business Loan',
        description: loanDesc,
        institution: 'Microfinance Banks / CBN MSME Fund',
        institutionUrl: 'https://www.cbn.gov.ng',
        estimatedCost: 'Varies by lender',
        estimatedTime: '1–4 weeks',
        completed: false,
      },
    ],
  };

  return roadmap;
}
