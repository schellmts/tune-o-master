import { z } from 'zod';

export const loginAdminSchema = z.object({
  usuario: z.string().trim().min(1, 'Informe o usuario.'),
  senha: z.string().trim().min(1, 'Informe a senha.'),
});

export const criarAdminSchema = z.object({
  usuario: z.string().trim().min(3, 'Usuario deve ter pelo menos 3 caracteres.'),
  senha: z.string().trim().min(4, 'Senha deve ter pelo menos 4 caracteres.'),
});

export const cordaSchema = z.object({
  nota: z.string().trim().min(1, 'Informe a nota de todas as cordas.'),
  frequencia: z.string().trim(),
});

export const afinacaoSchema = z.object({
  nomeAfinacao: z.string().trim().min(1, 'Informe o nome da afinacao.'),
  quantidadeCordas: z
    .number()
    .int('Quantidade de cordas invalida.')
    .min(1, 'Quantidade de cordas invalida.')
    .max(12, 'Maximo de 12 cordas.'),
  cordas: z.array(cordaSchema).min(1, 'Adicione pelo menos uma corda.'),
});

export const instrumentoSchema = z.object({
  nome: z.string().trim().min(2, 'Nome do instrumento deve ter pelo menos 2 caracteres.'),
  afinacoes: z.array(afinacaoSchema).min(1, 'Adicione pelo menos uma afinacao.'),
});

export type LoginAdminInput = z.infer<typeof loginAdminSchema>;
export type CriarAdminInput = z.infer<typeof criarAdminSchema>;
export type AfinacaoInput = z.infer<typeof afinacaoSchema>;
export type InstrumentoInput = z.infer<typeof instrumentoSchema>;
