import { z, ZodSchema } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export type ValidationSchema = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export function validate(schema: ValidationSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        next(new AppError(messages.join(', '), 400));
      } else {
        next(error);
      }
    }
  };
}

export { z };
export * from './admin.validator.js';
