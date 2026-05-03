import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import {
  useListProducts, useCreateProduct, useUpdateProduct, useDeleteProduct,
  useToggleProductVisibility, useToggleProductAvailability, useListCategories,
  useGetAdminMe, getListProductsQueryKey
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, ShoppingBag } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/currency";

interface VariantOption { label: string; priceAdjustment: number }
interface Variant { name: string; type: string; options: VariantOption[] }
interface Addon { name: string; price: number }

interface ProductFormData {
  name: string; slug: string; description: string; basePrice: string;
  categoryId: string; imageUrls: string; allowCustomMessage: boolean;
  isVisible: boolean; isAvailable: boolean;
}

type Product = { id: number; name: string; slug: string; description?: string | null; basePrice: string | number; categoryId?: number | null; imageUrls: unknown; variants: unknown; addons: unknown; allowCustomMessage: boolean; isVisible: boolean; isAvailable: boolean; category?: { name: string } | null; orderCount: number }

export default function AdminProductsPage() {
  const [, navigate] = useLocation();
  const { data: session, isLoading: loadingSession } = useGetAdminMe();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);

  useEffect(() => {
    if (!loadingSession && !session?.authenticated) navigate("/admin/login");
  }, [session, loadingSession]);

  const params = {};
  const { data: products, isLoading } = useListProducts(params, { query: { queryKey: getListProductsQueryKey(params) } });
  const { data: categories } = useListCategories();

  const form = useForm<ProductFormData>({
    defaultValues: { name: "", slug: "", description: "", basePrice: "", categoryId: "", imageUrls: "", allowCustomMessage: false, isVisible: true, isAvailable: true },
  });

  const createProduct = useCreateProduct({ mutation: { onSuccess: () => { queryClient.invalidateQueries(); setOpen(false); toast({ title: "Product created" }); } } });
  const updateProduct = useUpdateProduct({ mutation: { onSuccess: () => { queryClient.invalidateQueries(); setOpen(false); toast({ title: "Product updated" }); } } });
  const deleteProduct = useDeleteProduct({ mutation: { onSuccess: () => { queryClient.invalidateQueries(); toast({ title: "Product deleted" }); } } });
  const toggleVisibility = useToggleProductVisibility({ mutation: { onSuccess: () => queryClient.invalidateQueries() } });
  const toggleAvailability = useToggleProductAvailability({ mutation: { onSuccess: () => queryClient.invalidateQueries() } });

  const openCreate = () => {
    setEditing(null);
    setVariants([]);
    setAddons([]);
    form.reset({ name: "", slug: "", description: "", basePrice: "", categoryId: "", imageUrls: "", allowCustomMessage: false, isVisible: true, isAvailable: true });
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setVariants((p.variants as Variant[]) ?? []);
    setAddons((p.addons as Addon[]) ?? []);
    form.reset({
      name: p.name, slug: p.slug, description: p.description ?? "",
      basePrice: String(p.basePrice), categoryId: p.categoryId ? String(p.categoryId) : "",
      imageUrls: ((p.imageUrls as string[]) ?? []).join("\n"),
      allowCustomMessage: p.allowCustomMessage, isVisible: p.isVisible, isAvailable: p.isAvailable,
    });
    setOpen(true);
  };

  const onSubmit = (data: ProductFormData) => {
    const payload = {
      name: data.name, slug: data.slug, description: data.description || null,
      basePrice: Number(data.basePrice),
      categoryId: data.categoryId ? Number(data.categoryId) : null,
      imageUrls: data.imageUrls.split("\n").map(s => s.trim()).filter(Boolean),
      variants, addons,
      allowCustomMessage: data.allowCustomMessage,
      isVisible: data.isVisible, isAvailable: data.isAvailable,
    };
    if (editing) {
      updateProduct.mutate({ id: editing.id, data: payload });
    } else {
      createProduct.mutate({ data: payload });
    }
  };

  const addVariant = () => setVariants(v => [...v, { name: "Size", type: "size", options: [{ label: "Small", priceAdjustment: 0 }] }]);
  const addAddon = () => setAddons(a => [...a, { name: "Gift Box", price: 2 }]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold">Products</h1>
            <p className="text-sm text-muted-foreground">Manage your bakery catalog.</p>
          </div>
          <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i=><Skeleton key={i} className="h-20"/>)}</div>
        ) : !products?.length ? (
          <div className="text-center py-16 text-muted-foreground"><ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>No products yet. Add your first!</p></div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {products.map((p) => {
              const images = (p.imageUrls as string[]) ?? [];
              return (
                <Card key={p.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                      {images[0] ? <img src={images[0]} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-secondary/30 to-accent/30 flex items-center justify-center"><ShoppingBag className="h-6 w-6 text-muted-foreground/30" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(Number(p.basePrice))} {p.category && `· ${p.category.name}`}</p>
                      <p className="text-xs text-muted-foreground">{p.orderCount} orders</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Switch checked={p.isVisible} onCheckedChange={() => toggleVisibility.mutate({ id: p.id })} id={`vis-${p.id}`} />
                          <label htmlFor={`vis-${p.id}`} className="text-muted-foreground">Visible</label>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Switch checked={p.isAvailable} onCheckedChange={() => toggleAvailability.mutate({ id: p.id })} id={`avail-${p.id}`} />
                          <label htmlFor={`avail-${p.id}`} className="text-muted-foreground">In Stock</label>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p as Product)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if (confirm("Delete this product?")) deleteProduct.mutate({ id: p.id }); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Product" : "New Product"}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} onChange={(e) => { field.onChange(e); if (!editing) form.setValue("slug", e.target.value.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")); }} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="slug" render={({ field }) => (
                  <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="basePrice" render={({ field }) => (
                  <FormItem><FormLabel>Base Price (Rs.)</FormLabel><FormControl><Input type="number" step="1" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="categoryId" render={({ field }) => (
                  <FormItem><FormLabel>Category</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {categories?.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="imageUrls" render={({ field }) => (
                <FormItem><FormLabel>Image URLs (one per line)</FormLabel><FormControl><Textarea rows={3} placeholder="https://..." {...field} /></FormControl></FormItem>
              )} />

              {/* Variants */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-semibold">Variants</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addVariant}><Plus className="h-3 w-3 mr-1"/>Add Variant</Button>
                </div>
                {variants.map((v, vi) => (
                  <div key={vi} className="border border-border rounded-lg p-3 mb-2 space-y-2">
                    <div className="flex gap-2">
                      <Input value={v.name} onChange={e => { const nv=[...variants]; nv[vi]={...nv[vi],name:e.target.value}; setVariants(nv); }} placeholder="Variant name" className="flex-1" />
                      <Input value={v.type} onChange={e => { const nv=[...variants]; nv[vi]={...nv[vi],type:e.target.value}; setVariants(nv); }} placeholder="Type key" className="flex-1" />
                      <Button type="button" variant="ghost" size="icon" onClick={() => setVariants(v => v.filter((_,i)=>i!==vi))}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                    </div>
                    {v.options.map((opt, oi) => (
                      <div key={oi} className="flex gap-2 pl-4">
                        <Input value={opt.label} onChange={e => { const nv=[...variants]; nv[vi].options[oi].label=e.target.value; setVariants(nv); }} placeholder="Option label" className="flex-1" />
                        <Input type="number" step="0.01" value={opt.priceAdjustment} onChange={e => { const nv=[...variants]; nv[vi].options[oi].priceAdjustment=Number(e.target.value); setVariants(nv); }} placeholder="+0.00" className="w-24" />
                        <Button type="button" variant="ghost" size="icon" onClick={() => { const nv=[...variants]; nv[vi].options=nv[vi].options.filter((_,i)=>i!==oi); setVariants(nv); }}><Trash2 className="h-3 w-3 text-destructive"/></Button>
                      </div>
                    ))}
                    <Button type="button" variant="ghost" size="sm" className="ml-4 text-xs" onClick={() => { const nv=[...variants]; nv[vi].options.push({label:"",priceAdjustment:0}); setVariants(nv); }}><Plus className="h-3 w-3 mr-1"/>Add option</Button>
                  </div>
                ))}
              </div>

              {/* Add-ons */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-semibold">Add-ons</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addAddon}><Plus className="h-3 w-3 mr-1"/>Add Add-on</Button>
                </div>
                {addons.map((a, ai) => (
                  <div key={ai} className="flex gap-2 mb-2">
                    <Input value={a.name} onChange={e => { const na=[...addons]; na[ai].name=e.target.value; setAddons(na); }} placeholder="Add-on name" className="flex-1" />
                    <Input type="number" step="0.01" value={a.price} onChange={e => { const na=[...addons]; na[ai].price=Number(e.target.value); setAddons(na); }} placeholder="Price" className="w-24" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => setAddons(a=>a.filter((_,i)=>i!==ai))}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <FormField control={form.control} name="allowCustomMessage" render={({ field }) => (
                  <FormItem className="flex items-center gap-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Custom cake message</FormLabel></FormItem>
                )} />
                <FormField control={form.control} name="isVisible" render={({ field }) => (
                  <FormItem className="flex items-center gap-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Visible in store</FormLabel></FormItem>
                )} />
                <FormField control={form.control} name="isAvailable" render={({ field }) => (
                  <FormItem className="flex items-center gap-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>In stock</FormLabel></FormItem>
                )} />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1" disabled={createProduct.isPending || updateProduct.isPending}>
                  {editing ? "Save Changes" : "Create Product"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
