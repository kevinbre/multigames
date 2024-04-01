import * as z from "zod";

export const rouletteSchema = z.object({
    new_value: z.string().min(1, "Este campo es requerido"),
});

export type RouletteValues = z.infer<typeof rouletteSchema>;
