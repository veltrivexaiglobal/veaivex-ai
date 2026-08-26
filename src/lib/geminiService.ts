import { SaleRecord, ExpenseRecord, ProductItem, CustomerRecord, BusinessProfile, Language, ChatMessage, ChatFocusMode } from '../types';
import { analyzeQueryLocally, LocalAiResponse, detectLanguage } from './aiLocalEngine';

export interface GenerateAiResponseParams {
  query: string;
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
  products: ProductItem[];
  customers: CustomerRecord[];
  profile: BusinessProfile;
  history?: ChatMessage[];
  forceLanguage?: Language;
  focusMode?: ChatFocusMode;
}

export async function askVeaivexAi(params: GenerateAiResponseParams): Promise<LocalAiResponse> {
  const { query, sales, expenses, products, customers, profile, history, forceLanguage, focusMode } = params;
  const detectedLang = forceLanguage || detectLanguage(query);

  try {
    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: query,
        language: detectedLang,
        focusMode: focusMode || 'business',
        businessContext: {
          profile,
          salesCount: sales.length,
          recentSales: sales.slice(0, 10),
          recentExpenses: expenses.slice(0, 8),
          products: products.map((p) => ({
            name: p.name,
            currentStock: p.currentStock,
            daysRemaining: p.daysOfStockRemaining,
            stockStatus: p.stockStatus,
            unitPrice: p.unitPrice,
            marginPct: p.marginPct,
          })),
          customers: customers.map((c) => ({
            name: c.name,
            totalSpend: c.totalSpend,
            daysSinceLastOrder: c.daysSinceLastOrder,
            status: c.status,
          })),
        },
        history: history ? history.slice(-4).map((m) => ({ role: m.sender, content: m.content })) : [],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.answer) {
        return {
          answer: data.answer,
          why: data.why || 'Based on real-time multi-dimensional intelligence analysis.',
          evidence: Array.isArray(data.evidence) ? data.evidence : [],
          recommendedAction: data.recommendedAction || 'Review the strategic and operational takeaways provided above.',
          prediction: data.prediction,
          aiSocietyRedirects: Array.isArray(data.aiSocietyRedirects) ? data.aiSocietyRedirects : undefined,
          language: data.language || detectedLang,
        };
      }
    }
  } catch (error) {
    console.info('Server AI call unavailable or offline, switching smoothly to local deterministic reasoning engine:', error);
  }

  // Fallback to our high-precision local BI reasoning engine
  return analyzeQueryLocally(query, sales, expenses, products, customers, profile, focusMode);
}
