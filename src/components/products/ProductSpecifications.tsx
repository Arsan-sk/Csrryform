import type { Product } from '@/types/product';

interface ProductSpecificationsProps {
  product: Product;
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const specs = product.specifications || {};

  // Build key-value pairs of verified details only
  const items: { label: string; value: string }[] = [];

  items.push({ label: 'Category', value: product.type.replace(/_/g, ' ') });

  if (specs.dimensions) items.push({ label: 'Dimensions', value: String(specs.dimensions) });
  if (specs.capacityLitres) items.push({ label: 'Capacity', value: `${specs.capacityLitres} L` });
  if (specs.bagType) items.push({ label: 'Silhouette', value: String(specs.bagType) });
  if (specs.closure) items.push({ label: 'Closure', value: String(specs.closure) });
  if (specs.material) items.push({ label: 'Material', value: String(specs.material) });
  if (specs.compartments) items.push({ label: 'Compartments', value: String(specs.compartments) });
  if (specs.strapType) items.push({ label: 'Strap Type', value: String(specs.strapType) });
  if (specs.laptopSleeveSize) items.push({ label: 'Laptop Sleeve', value: String(specs.laptopSleeveSize) });
  if (specs.bottlePocket !== undefined) items.push({ label: 'Side Pocket', value: specs.bottlePocket ? 'Yes' : 'No' });
  if (specs.strapPadding !== undefined) items.push({ label: 'Padded Straps', value: specs.strapPadding ? 'Yes' : 'No' });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between py-2 border-b border-espresso/5">
          <span className="text-espresso/60 font-mono text-xs uppercase tracking-wider">{item.label}</span>
          <span className="text-espresso font-medium capitalize">{item.value}</span>
        </div>
      ))}
      {items.length === 1 && (
        <p className="text-xs text-espresso/40 italic col-span-2 py-2">
          Specific dimensions &amp; material measurements will be updated upon official showroom release.
        </p>
      )}
    </div>
  );
}

