import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useListCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, useGetAdminMe } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface CatForm { name: string; slug: string; description: string; imageUrl: string; sortOrder: string }

export default function AdminCategoriesPage() {
  const [, navigate] = useLocation();
  const { data: session, isLoading: loadingSession } = useGetAdminMe();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    if (!loadingSession && !session?.authenticated) navigate("/admin/login");
  }, [session, loadingSession]);

  const { data: categories, isLoading } = useListCategories();
  const form = useForm<CatForm>({ defaultValues: { name: "", slug: "", description: "", imageUrl: "", sortOrder: "0" } });

  const create = useCreateCategory({ mutation: { onSuccess: () => { queryClient.invalidateQueries(); setOpen(false); toast({ title: "Category created" }); } } });
  const update = useUpdateCategory({ mutation: { onSuccess: () => { queryClient.invalidateQueries(); setOpen(false); toast({ title: "Category updated" }); } } });
  const del = useDeleteCategory({ mutation: { onSuccess: () => { queryClient.invalidateQueries(); toast({ title: "Category deleted" }); } } });

  const openCreate = () => { setEditId(null); form.reset({ name: "", slug: "", description: "", imageUrl: "", sortOrder: "0" }); setOpen(true); };
  const openEdit = (c: { id: number; name: string; slug: string; description?: string | null; imageUrl?: string | null; sortOrder: number }) => {
    setEditId(c.id);
    form.reset({ name: c.name, slug: c.slug, description: c.description ?? "", imageUrl: c.imageUrl ?? "", sortOrder: String(c.sortOrder) });
    setOpen(true);
  };

  const onSubmit = (data: CatForm) => {
    const payload = { name: data.name, slug: data.slug, description: data.description || null, imageUrl: data.imageUrl || null, sortOrder: Number(data.sortOrder) };
    if (editId) update.mutate({ id: editId, data: payload });
    else create.mutate({ data: payload });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-serif font-bold">Categories</h1><p className="text-sm text-muted-foreground">Organize your products.</p></div>
          <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4"/>Add Category</Button>
        </div>
        {isLoading ? <div className="space-y-3">{[1,2,3].map(i=><Skeleton key={i} className="h-16"/>)}</div>
          : !categories?.length ? <div className="text-center py-16 text-muted-foreground"><Tag className="h-10 w-10 mx-auto mb-3 opacity-30"/><p>No categories yet.</p></div>
          : <div className="grid grid-cols-1 gap-3">
              {categories.map(cat => (
                <Card key={cat.id}><CardContent className="p-4 flex items-center gap-4">
                  {cat.imageUrl && <img src={cat.imageUrl} alt={cat.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />}
                  <div className="flex-1"><p className="font-semibold">{cat.name}</p><p className="text-xs text-muted-foreground">{cat.slug} · Sort: {cat.sortOrder}</p>{cat.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{cat.description}</p>}</div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}><Pencil className="h-4 w-4"/></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if(confirm("Delete?")) del.mutate({ id: cat.id }); }}><Trash2 className="h-4 w-4"/></Button>
                  </div>
                </CardContent></Card>
              ))}
            </div>
        }
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editId ? "Edit Category" : "New Category"}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} onChange={e => { field.onChange(e); if (!editId) form.setValue("slug", e.target.value.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")); }}/></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={2} {...field}/></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field}/></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="sortOrder" render={({ field }) => (
                <FormItem><FormLabel>Sort Order</FormLabel><FormControl><Input type="number" {...field}/></FormControl></FormItem>
              )} />
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1" disabled={create.isPending || update.isPending}>{editId ? "Save" : "Create"}</Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
