import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { z } from '@medusajs/framework/zod';
import { FASHION_MODULE } from '../../../../../modules/fashion';
import FashionModuleService from '../../../../../modules/fashion/service';

const CreateColorSchema = z.object({
  name: z.string(),
  hex_code: z.string(),
});

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const fashionModuleService: FashionModuleService = req.scope.resolve(FASHION_MODULE);
  const colors = await fashionModuleService.listColors({ material_id: req.params.id });
  res.json({ colors });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const fashionModuleService: FashionModuleService = req.scope.resolve(FASHION_MODULE);
  const body = CreateColorSchema.parse(req.body);
  const color = await fashionModuleService.createColors({
    ...body,
    material_id: req.params.id,
  });
  res.json({ color });
};
