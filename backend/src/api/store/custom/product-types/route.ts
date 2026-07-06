import { MedusaRequest, MedusaResponse } from '@medusajs/framework';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve('query');

  const limit = Number(req.query.limit) || 20;
  const offset = Number(req.query.offset) || 0;
  const filters: Record<string, unknown> = {};
  if (req.query.handle) filters.handle = req.query.handle;
  if (req.query.id) filters.id = req.query.id;
  if (req.query.value) filters.value = req.query.value;

  const { data: productTypes, metadata } = await query.graph({
    entity: 'product_types',
    fields: ['id', 'value', 'metadata', 'created_at', 'updated_at'],
    filters: Object.keys(filters).length ? filters : undefined,
    pagination: { take: limit, skip: offset },
  });

  res.json({
    product_types: productTypes,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? limit,
  });
};
