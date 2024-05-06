import { z } from 'zod';

export const validateMinLength = (minLength: number, message: string) =>
  z.string().min(minLength, { message });

export const validateMaxDuration = (maxDuration: number, message: string) =>
  z.coerce.number().lte(maxDuration, { message });

export const validateDifficultyRange = (
  minValue: number,
  maxValue: number,
  message: string
) => z.coerce.number().lte(maxValue, { message }).gte(minValue, { message });

export const validateEmail = (email: string) => z.string().email(email);
