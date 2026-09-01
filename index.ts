import { NetworkId } from '../types';
import { NETWORKS } from '../data/mockData';

export function formatNaira(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₦0.00';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace('NGN', '₦')
    .trim();
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-NG').format(num);
}

export function detectNetworkFromPhone(phone: string): NetworkId | null {
  if (!phone) return null;
  // Clean phone string (remove spaces, dashes, +234)
  let clean = phone.replace(/[^0-9+]/g, '');
  if (clean.startsWith('+234')) {
    clean = '0' + clean.slice(4);
  } else if (clean.startsWith('234')) {
    clean = '0' + clean.slice(3);
  }

  if (clean.length < 4) return null;
  const prefix = clean.slice(0, 4);

  for (const [netId, netInfo] of Object.entries(NETWORKS)) {
    if (netInfo.prefixes.includes(prefix)) {
      return netId as NetworkId;
    }
  }

  return null;
}

export function sanitizePhone(phone: string): string {
  let clean = phone.replace(/[^0-9+]/g, '');
  if (clean.startsWith('+234')) {
    clean = '0' + clean.slice(4);
  } else if (clean.startsWith('234')) {
    clean = '0' + clean.slice(3);
  }
  return clean;
}

export function isValidNigerianPhone(phone: string): boolean {
  const sanitized = sanitizePhone(phone);
  return /^0[789][01]\d{8}$/.test(sanitized);
}

export function generateReference(prefix = 'PFX'): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${dateStr}-${randomPart}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getInitials(name: string): string {
  if (!name) return 'PF';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
