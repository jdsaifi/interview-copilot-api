import { Router } from 'express';

import RoutesV1 from './v1';

const router = Router();

router.use('/v1', RoutesV1);

export default router;
