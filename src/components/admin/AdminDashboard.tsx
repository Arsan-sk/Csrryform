'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { AdminContent } from '@/types/admin';
import type { Product } from '@/types/product';
import { clearAdminSession, hasAdminSession } from '@/lib/admin-auth';
import { localRepository } from '@/lib/data/local-repository';
import { useRouter } from 'next/navigation';

type Panel = 'overview' | 'products' | 'collections' | 'content';

const panelMeta: Record<Panel, { label: string; icon: string }> = {
  overview: { label: 'Overview', icon: '⌂' },
  products: { label: 'Products', icon: '▦' },
  collections: { label: 'Collections', icon: '◇' },
  content: { label: 'Content', icon: '✦' },
};

const emptyProduct: Product = {
  id: '',
  slug: '',
  name: '',
  audience: 'womens',
  type: 'other',
  categorySlug: '',
  collectionSlugs: [],
  shortDescription: '',
  description: '',
  price: null,
  currency: 'INR',
  availability: 'enquire',
  images: [],
  specifications: {},
  variants: [],
  flags: { featured: false, new: false, active: true },
  contentStatus: 'demo',
};

export function AdminDashboard() {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>('overview');
  const [content, setContent] = useState<AdminContent | null>(null);
  const [query, setQuery] = useState('');
  const [audience, setAudience] = useState('all');
  const [editing, setEditing] = useState<Product | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!hasAdminSession()) {
      router.replace('/admin');
      return;
    }
    const timer = window.setTimeout(() => setContent(localRepository.getContent()), 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  function save(next: AdminContent, message: string) {
    localRepository.saveContent(next);
    setContent({ ...next, updatedAt: new Date().toISOString() });
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  }

  function signOut() {
    clearAdminSession();
    router.replace('/admin');
  }

  if (!content) return <div className="p-10 text-sm text-espresso/60">Loading workspace…</div>;

  const filteredProducts = content.products.filter((product) => {
    const matchesQuery = `${product.name} ${product.slug}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (audience === 'all' || product.audience === audience);
  });
  const featuredCount = content.products.filter((product) => product.flags.featured && product.flags.active).length;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" className="font-serif text-2xl">CARRYFORM</Link>
        <p className="font-mono text-[10px] tracking-[0.24em] text-espresso/40 uppercase mt-2">Content studio</p>
        <nav className="admin-nav" aria-label="Admin navigation">
          {(['overview', 'products', 'collections', 'content'] as Panel[]).map((item) => (
            <button key={item} onClick={() => setPanel(item)} className={`admin-nav-item ${panel === item ? 'is-active' : ''}`}>
              <span className="admin-nav-icon" aria-hidden="true">{panelMeta[item].icon}</span>
              <span>{panelMeta[item].label}</span>
            </button>
          ))}
          <button onClick={signOut} className="admin-nav-item admin-nav-logout">
            <span className="admin-nav-icon" aria-hidden="true">↪</span>
            <span>Logout</span>
          </button>
        </nav>
        <div className="mt-auto pt-8">
          <Link href="/" className="text-xs text-espresso/55 hover:text-wine block mb-4">View live site ↗</Link>
          <button onClick={signOut} className="text-xs text-wine">Sign out</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-wine mb-2">The art of carrying</p>
            <h1 className="font-serif text-4xl">{panel === 'overview' ? 'Good morning.' : panel === 'content' ? 'Website content' : panel[0].toUpperCase() + panel.slice(1)}</h1>
          </div>
          {notice && <p role="status" className="text-sm text-sage bg-sage/15 px-3 py-2">{notice}</p>}
        </header>

        {panel === 'overview' && (
          <Overview content={content} featuredCount={featuredCount} onNavigate={setPanel} />
        )}
        {panel === 'products' && (
          <section>
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <input className="admin-input flex-1" placeholder="Search products…" value={query} onChange={(event) => setQuery(event.target.value)} />
              <select className="admin-input md:w-52" value={audience} onChange={(event) => setAudience(event.target.value)}>
                <option value="all">All audiences</option><option value="womens">Women&apos;s bags</option><option value="student">School &amp; student</option>
              </select>
              <button onClick={() => setEditing({ ...emptyProduct, id: `local-${Date.now()}`, slug: `new-product-${Date.now()}` })} className="admin-primary whitespace-nowrap">Add product</button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Product</th><th>Audience</th><th>Status</th><th>Featured</th><th /></tr></thead>
                <tbody>{filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td><strong>{product.name}</strong><span className="block text-xs text-espresso/45">{product.slug}</span></td>
                    <td>{product.audience === 'student' ? 'School & student' : "Women's"}</td>
                    <td><button onClick={() => save({ ...content, products: content.products.map((item) => item.id === product.id ? { ...item, flags: { ...item.flags, active: !item.flags.active } } : item) }, 'Product status saved')} className={`status-pill ${product.flags.active ? 'is-on' : ''}`}>{product.flags.active ? 'Active' : 'Hidden'}</button></td>
                    <td>{product.flags.featured ? 'Yes' : '—'}</td>
                    <td className="text-right"><button onClick={() => setEditing(product)} className="text-wine text-sm">Edit</button></td>
                  </tr>
                ))}</tbody>
              </table>
              {!filteredProducts.length && <p className="p-8 text-sm text-espresso/55">No products match this search.</p>}
            </div>
          </section>
        )}
        {panel === 'collections' && <CollectionsPanel content={content} save={save} />}
        {panel === 'content' && <ContentPanel content={content} save={save} />}
      </main>
      {editing && <ProductEditor product={editing} collections={content.collections} onClose={() => setEditing(null)} onSave={(product) => {
        const exists = content.products.some((item) => item.id === product.id);
        save({ ...content, products: exists ? content.products.map((item) => item.id === product.id ? product : item) : [...content.products, product] }, exists ? 'Product updated' : 'Product created');
        setEditing(null);
      }} />}
    </div>
  );
}

function Overview({ content, featuredCount, onNavigate }: { content: AdminContent; featuredCount: number; onNavigate: (panel: Panel) => void }) {
  const student = content.products.filter((product) => product.audience === 'student').length;
  const active = content.products.filter((product) => product.flags.active).length;
  return <div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {[['Active products', active], ["Women's bags", content.products.filter((product) => product.audience === 'womens').length], ['School & student', student], ['Featured pieces', featuredCount]].map(([label, value]) => <div className="admin-stat" key={label as string}><span>{label}</span><strong>{value}</strong></div>)}
    </div>
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="admin-card"><p className="font-mono text-[10px] tracking-widest uppercase text-wine mb-3">Quick actions</p><div className="space-y-2"><button onClick={() => onNavigate('products')} className="admin-action">Manage catalogue <span>→</span></button><button onClick={() => onNavigate('collections')} className="admin-action">Edit collections <span>→</span></button><button onClick={() => onNavigate('content')} className="admin-action">Update contact &amp; brand <span>→</span></button></div></div>
      <div className="admin-card"><p className="font-mono text-[10px] tracking-widest uppercase text-wine mb-3">Workspace status</p><p className="text-sm leading-relaxed text-espresso/65">Local demo storage is active. Changes are kept in this browser and the seeded catalogue remains available as a resettable fallback.</p><p className="text-xs text-espresso/40 mt-5">Last saved {new Date(content.updatedAt).toLocaleString()}</p></div>
    </div>
  </div>;
}

function CollectionsPanel({ content, save }: { content: AdminContent; save: (content: AdminContent, message: string) => void }) {
  return <div className="grid md:grid-cols-2 gap-5">{content.collections.map((collection) => <div className="admin-card" key={collection.slug}><div className="flex justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-widest text-wine">{collection.audience}</p><h2 className="font-serif text-2xl mt-2">{collection.title}</h2></div><button onClick={() => save({ ...content, collections: content.collections.map((item) => item.slug === collection.slug ? { ...item, isFeatured: !item.isFeatured } : item) }, 'Collection settings saved')} className={`status-pill ${collection.isFeatured ? 'is-on' : ''}`}>{collection.isFeatured ? 'Featured' : 'Standard'}</button></div><p className="text-sm text-espresso/60 leading-relaxed mt-4">{collection.description}</p><p className="text-xs text-espresso/40 mt-5">{content.products.filter((product) => product.collectionSlugs.includes(collection.slug)).length} products in collection</p></div>)}</div>;
}

function ContentPanel({ content, save }: { content: AdminContent; save: (content: AdminContent, message: string) => void }) {
  const [site, setSite] = useState(content.site);
  const [contact, setContact] = useState(content.contact);
  return <div className="grid lg:grid-cols-2 gap-6">
    <form className="admin-card space-y-4" onSubmit={(event) => { event.preventDefault(); save({ ...content, site, contact }, 'Website content saved'); }}>
      <h2 className="font-serif text-2xl">Brand &amp; SEO</h2>
      <Field label="Brand name" value={site.brand} onChange={(value) => setSite({ ...site, brand: value })} />
      <Field label="Descriptor" value={site.descriptor} onChange={(value) => setSite({ ...site, descriptor: value })} />
      <Field label="Tagline" value={site.tagline} onChange={(value) => setSite({ ...site, tagline: value })} />
      <Field label="Default description" value={site.seo.defaultDescription} onChange={(value) => setSite({ ...site, seo: { ...site.seo, defaultDescription: value } })} />
      <h2 className="font-serif text-2xl pt-4">Contact &amp; footer</h2>
      <Field label="Address" value={contact.address} onChange={(value) => setContact({ ...contact, address: value })} />
      <Field label="Email" value={contact.email ?? ''} onChange={(value) => setContact({ ...contact, email: value || null })} />
      <Field label="Creator credit text" value={contact.footerCredit.text} onChange={(value) => setContact({ ...contact, footerCredit: { ...contact.footerCredit, text: value } })} />
      <button className="admin-primary" type="submit">Save website content</button>
    </form>
    <div className="admin-card h-fit"><h2 className="font-serif text-2xl mb-3">Media guidance</h2><p className="text-sm text-espresso/65 leading-relaxed">The current catalogue uses image references from the public assets folder. Product image URLs and alt text are edited in the product record; binary uploads should move to Supabase Storage or IndexedDB before production.</p><button onClick={() => { if (window.confirm('Reset all local content to the demo catalogue?')) { localRepository.resetContent(); window.location.reload(); } }} className="text-sm text-wine mt-8">Reset demo content</button></div>
  </div>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block text-sm font-medium">{label}<input className="admin-input mt-2" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function ProductEditor({ product, collections, onClose, onSave }: { product: Product; collections: AdminContent['collections']; onClose: () => void; onSave: (product: Product) => void }) {
  const [draft, setDraft] = useState(product);
  const update = (patch: Partial<Product>) => setDraft((current) => ({ ...current, ...patch }));
  return <div className="admin-modal-backdrop"><div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="product-editor-title"><div className="flex justify-between items-start mb-6"><div><p className="font-mono text-[10px] uppercase tracking-widest text-wine">Catalogue record</p><h2 id="product-editor-title" className="font-serif text-3xl mt-2">{product.name || 'New product'}</h2></div><button onClick={onClose} aria-label="Close editor" className="text-2xl text-espresso/50">×</button></div><div className="grid sm:grid-cols-2 gap-4"><Field label="Product name" value={draft.name} onChange={(value) => update({ name: value })} /><Field label="Slug" value={draft.slug} onChange={(value) => update({ slug: value })} /><Field label="Short description" value={draft.shortDescription} onChange={(value) => update({ shortDescription: value })} /><label className="block text-sm font-medium">Audience<select className="admin-input mt-2" value={draft.audience} onChange={(event) => update({ audience: event.target.value as Product['audience'] })}><option value="womens">Women&apos;s bags</option><option value="student">School &amp; student</option><option value="everyday">Everyday</option><option value="unisex">Unisex</option></select></label><Field label="Primary image URL" value={draft.images[0]?.url ?? ''} onChange={(value) => update({ images: value ? [{ url: value, alt: draft.name, role: 'primary' }, ...draft.images.slice(1)] : draft.images })} /><Field label="Image alt text" value={draft.images[0]?.alt ?? ''} onChange={(value) => update({ images: draft.images.length ? [{ ...draft.images[0], alt: value }, ...draft.images.slice(1)] : [] })} /></div><div className="flex flex-wrap gap-5 mt-5 text-sm"><label><input type="checkbox" checked={draft.flags.active} onChange={(event) => update({ flags: { ...draft.flags, active: event.target.checked } })} /> <span className="ml-1">Active</span></label><label><input type="checkbox" checked={draft.flags.featured} onChange={(event) => update({ flags: { ...draft.flags, featured: event.target.checked } })} /> <span className="ml-1">Featured</span></label><label><input type="checkbox" checked={draft.flags.new} onChange={(event) => update({ flags: { ...draft.flags, new: event.target.checked } })} /> <span className="ml-1">New arrival</span></label></div><div className="mt-6"><p className="text-sm font-medium mb-2">Collections</p><div className="flex flex-wrap gap-2">{collections.map((collection) => <label key={collection.slug} className="text-xs border border-espresso/15 px-3 py-2"><input type="checkbox" checked={draft.collectionSlugs.includes(collection.slug)} onChange={(event) => update({ collectionSlugs: event.target.checked ? [...draft.collectionSlugs, collection.slug] : draft.collectionSlugs.filter((slug) => slug !== collection.slug) })} /> <span className="ml-1">{collection.title}</span></label>)}</div></div><div className="flex justify-end gap-3 mt-8 pt-5 border-t border-espresso/10"><button onClick={onClose} className="admin-secondary">Cancel</button><button onClick={() => onSave(draft)} className="admin-primary">Save product</button></div></div></div>;
}
