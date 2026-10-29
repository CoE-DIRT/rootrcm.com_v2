/** Public contact fields only. Never solicit or accept PHI. */
export type BusinessContact={name:string;email:string;organization:string;message?:string};
export function isBusinessContact(value:unknown):value is BusinessContact{if(!value||typeof value!=='object')return false;const r=value as Record<string,unknown>;return ['name','email','organization'].every(k=>typeof r[k]==='string'&&(r[k] as string).trim().length>1) && typeof r.email==='string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email);}
