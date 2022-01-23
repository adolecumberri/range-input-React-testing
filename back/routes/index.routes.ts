import { Router } from 'express'
import { getRange, getValues } from '../controllers/index.controller'

const router = Router();

router.route('/range').get(getRange);

router.route('/values/:length').get(getValues);

export default router;