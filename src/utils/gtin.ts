// Le portail range les codes-barres UPC-A sur 13 chiffres, avec un 0 devant (198057000002 est
// introuvable, 0198057000002 répond). iOS renvoie déjà ce format, Android renvoie 12 chiffres :
// on ramène tout au format du portail.

// UPC-E (8 chiffres : système, 6 chiffres, contrôle) vers UPC-A (12 chiffres).
function expandUpcE(code: string): string {
  const [system, d1, d2, d3, d4, d5, d6, check] = code;
  let body: string;
  if ('012'.includes(d6)) body = `${d1}${d2}${d6}0000${d3}${d4}${d5}`;
  else if (d6 === '3') body = `${d1}${d2}${d3}00000${d4}${d5}`;
  else if (d6 === '4') body = `${d1}${d2}${d3}${d4}00000${d5}`;
  else body = `${d1}${d2}${d3}${d4}${d5}0000${d6}`;
  return `${system}${body}${check}`;
}

export function normalizeGtin(data: string, type?: string): string {
  let code = data.replace(/\D/g, '');
  if (type === 'upc_e' && code.length === 8) code = expandUpcE(code);
  return code.length === 12 ? `0${code}` : code;
}
