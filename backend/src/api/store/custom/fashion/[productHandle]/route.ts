import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { FASHION_MODULE } from '../../../../../modules/fashion';
import FashionModuleService from '../../../../../modules/fashion/service';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { productHandle } = req.params;
  const query = req.scope.resolve('query');
  const fashionModuleService: FashionModuleService = req.scope.resolve(FASHION_MODULE);

  const {
    data: [product],
  } = await query.graph({
    entity: 'product',
    filters: { handle: productHandle },
    fields: [
      'id',
      'handle',
      'options.id',
      'options.title',
      'variants.id',
      'variants.options.value',
      'variants.options.option_id',
    ],
  });

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const materialOption = (product.options as any[])?.find(
    (o: any) => o.title === 'Material'
  );
  const colorOption = (product.options as any[])?.find(
    (o: any) => o.title === 'Color'
  );

  if (!materialOption && !colorOption) {
    return res.json({ materials: [] });
  }

  // Build a map of material name -> set of color names from variant combinations
  const materialColorMap = new Map<string, Set<string>>();

  for (const variant of (product.variants as any[]) ?? []) {
    let materialValue: string | undefined;
    let colorValue: string | undefined;

    for (const opt of (variant.options as any[]) ?? []) {
      if (materialOption && opt.option_id === materialOption.id) {
        materialValue = opt.value;
      }
      if (colorOption && opt.option_id === colorOption.id) {
        colorValue = opt.value;
      }
    }

    if (materialValue) {
      if (!materialColorMap.has(materialValue)) {
        materialColorMap.set(materialValue, new Set());
      }
      if (colorValue) {
        materialColorMap.get(materialValue)!.add(colorValue);
      }
    }
  }

  const materialNames = Array.from(materialColorMap.keys());

  if (materialNames.length === 0) {
    return res.json({ materials: [] });
  }

  const materials = await fashionModuleService.listMaterials(
    { name: materialNames },
    { relations: ['colors'] }
  );

  const result = materials.map((material: any) => ({
    id: material.id,
    name: material.name,
    colors: ((material.colors as any[]) ?? []).filter((color: any) =>
      materialColorMap.get(material.name)?.has(color.name)
    ),
  }));

  return res.json({ materials: result });
};
