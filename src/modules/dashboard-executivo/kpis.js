// Indicadores exibidos no dashboard executivo.
// Cada item segue o formato:
// {
//   id: 'identificador-unico',
//   label: 'Nome do indicador',
//   value: '0',               // valor já formatado para exibição
//   hint: 'Meta, variação ou fonte do dado',  // opcional
// }
// Quando os dados vierem do Supabase, substitua esta lista por uma consulta
// usando o cliente de src/lib/supabaseClient.js.
export const KPIS = [];
