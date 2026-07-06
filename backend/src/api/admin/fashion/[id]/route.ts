import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { z } from '@medusajs/framework/zod';
import { FASHION_MODULE } from '../../../../modules/fashion';
import FashionModuleService from '../../../../modules/fashion/service';

const UpdateMaterialSchema = z.object({
  name: z.string().optional(),
});

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const fashionModuleService: FashionModuleService = req.scope.resolve(FASHION_MODULE);
  const material = await fashionModuleService.retrieveMaterial(req.params.id, {
    relations: ['colors'],
  });
  res.json({ material });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const fashionModuleService: FashionModuleService = req.scope.resolve(FASHION_MODULE);
  const body = UpdateMaterialSchema.parse(req.body);
  const material = await fashionModuleService.updateMaterials({ id: req.params.id, ...body });
  res.json({ material });
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const fashionModuleService: FashionModuleService = req.scope.resolve(FASHION_MODULE);
  await fashionModuleService.deleteMaterials(req.params.id);
  res.json({ id: req.params.id, deleted: true });
};
