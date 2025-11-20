import { Response, NextFunction } from 'express';
import { UserRole } from '@hotel/domain/src/entities/User';
import { AuthRequest } from './authMiddleware';

/**
 * Middleware para verificar que el usuario tenga uno de los roles permitidos
 * @param allowedRoles Array de roles permitidos para acceder a la ruta
 */
export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Verificar que el usuario esté autenticado (debería venir del authMiddleware)
      if (!req.user) {
        return res.status(401).json({ 
          message: 'Authentication required' 
        });
      }

      // Verificar que el rol del usuario esté en los roles permitidos
      if (!allowedRoles.includes(req.user.role as UserRole)) {
        return res.status(403).json({ 
          message: 'Insufficient permissions. Required roles: ' + allowedRoles.join(', '),
          userRole: req.user.role
        });
      }

      // Si pasa la validación, continuar
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      return res.status(500).json({ 
        message: 'Internal server error in role validation' 
      });
    }
  };
};