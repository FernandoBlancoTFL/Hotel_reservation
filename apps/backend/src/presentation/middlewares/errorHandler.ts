import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  if (error.message.includes('not found')) {
    return res.status(404).json({ error: error.message });
  }

  if (error.message.includes('already exists')) {
    return res.status(409).json({ error: error.message });
  }

  if (error.message.includes('permission') || error.message.includes('Invalid email or password')) {
    return res.status(403).json({ error: error.message });
  }

  res.status(500).json({ error: 'Internal server error' });
};