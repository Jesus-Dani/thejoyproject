import { z } from "zod";

export const checkoutInitSchema = z.object({
  buyerName: z.string().trim().min(2, "Enter your full name").max(120),
  buyerEmail: z.string().trim().email("Enter a valid email"),
  buyerPhone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  ticketTypeCode: z.enum(["COMBO", "FRIDAY_ONLY", "SATURDAY_ONLY"]),
  showingId: z.string().uuid().optional(),
  quantity: z.coerce.number().int().min(1).max(20),
});

export type CheckoutInitInput = z.infer<typeof checkoutInitSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  organization: z.string().trim().max(160).optional(),
  message: z.string().trim().min(10, "Tell us a little more").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const checkinScanSchema = z.object({
  token: z.string().min(1),
  sessionId: z.string().uuid(),
});

export const loginSchema = z.object({
  password: z.string().min(1),
});
