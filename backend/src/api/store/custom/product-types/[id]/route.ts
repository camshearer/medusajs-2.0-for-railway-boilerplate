import { MedusaRequest, MedusaResponse } from '@medusajs/framework';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve('query');

  const { data: [productType] } = await query.graph({
    entity: 'product_types',
    fields: ['id', 'value', 'metadata', 'created_at', 'updated_at'],
    filters: { id: req.params.id },
  });

  if (!productType) {
    return res.status(404).json({ message: 'Product type not found' });
  }

  return res.status(200).json({ product_type: productType });
};
