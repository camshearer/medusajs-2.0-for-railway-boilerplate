import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { z } from '@medusajs/framework/zod';
import { FASHION_MODULE } from '../../../modules/fashion';
import FashionModuleService from '../../../modules/fashion/service';

const CreateMaterialSchema = z.object({
  name: z.string(),
});

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const fashionModuleService: FashionModuleService = req.scope.resolve(FASHION_MODULE);
  const materials = await fashionModuleService.listMaterials({}, { relations: ['colors'] });
  res.json({ materials });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const fashionModuleService: FashionModuleService = req.scope.resolve(FASHION_MODULE);
  const body = CreateMaterialSchema.parse(req.body);
  const material = await fashionModuleService.createMaterials(body);
  res.json({ material });
};
