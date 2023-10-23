// session.middleware.ts

import { Request, Response, NextFunction } from 'express';

export function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  // Assurez-vous que vous avez configuré express-session avec le nom du cookie que vous utilisez ici.
  // Si le nom du cookie est différent, assurez-vous de l'ajuster ici.
  const session = req.session;
  res.locals.session = session; // Rend la session disponible pour les composants React
  next();
}
