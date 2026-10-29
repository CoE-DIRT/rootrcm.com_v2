import type {ButtonHTMLAttributes} from 'react';
type Props=ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary';loading?:boolean};
export function Button({variant='primary',loading=false,disabled,children,...props}:Props){return <button {...props} type={props.type??'button'} className={variant==='primary'?'btn-primary':'btn-outline'} disabled={disabled||loading} aria-busy={loading}>{loading?'Working…':children}</button>}
