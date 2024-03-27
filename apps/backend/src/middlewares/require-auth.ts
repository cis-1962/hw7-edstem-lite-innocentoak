import { Request, Response, NextFunction } from 'express';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {

    if (!req.session || !req.session.userId) {

        return res.status(401).send('unauthorized');

    }

    next();
};

export default requireAuth;
