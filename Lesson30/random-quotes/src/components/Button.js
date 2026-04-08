export function Button ({variant, onClick, children}) {
  let buttonStyles = '';

  switch(variant) {
    case 'primary': 
      buttonStyles = 'bg-slate-400/90 text-slate-900 rounded-md';
      break;
    case 'secondary': 
      buttonStyles = 'bg-slate-200/90 text-slate-800 rounded-md';
      break;
    case 'icon': 
      buttonStyles = 'hover:bg-slate-200/90 rounded-full';
      break;
    default:
      buttonStyles = 'bg-slate-400/90 text-slate-900 rounded-md';
  }

  return (
    <button className={`text-md font-semibold py-2 px-4 flex gap-2 text-center justify-center ${buttonStyles}`} onClick={onClick}>
      {children}
    </button>
  );
}
