import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useListBanners, useCreateBanner, useUpdateBanner, useDeleteBanner, useGetAdminMe } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, Image } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface BannerForm { title: string; subtitle: string; imageUrl: string; linkUrl: string; isActive: boolean; sortOrder: string }

export default function AdminBannersPage() {
  const [, navigate] = useLocation();
  const { data: session, isLoading: loadingSession } = useGetAdminMe();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    if (!loadingSession && !session?.authenticated) navigate("/admin/login");
  }, [session, loadingSession]);

  const { data: banners, isLoading } = useListBanners();
  const form = useForm<BannerForm>({ defaultValues: { title: "", subtitle: "", imageUrl: "", linkUrl: "", isActive: true, sortOrder: "0" } });

  const create = useCreateBanner({ mutation: { onSuccess: () => { queryClient.invalidateQueries(); setOpen(false); toast({ title: "Banner created" }); } } });
  const update = useUpdateBanner({ mutation: { onSuccess: () => { queryClient.invalidateQueries(); setOpen(false); toast({ title: "Banner updated" }); } } });
  const del = useDeleteBanner({ mutation: { onSuccess: () => { queryClient.invalidateQueries(); toast({ title: "Banner deleted" }); } } });

  const openCreate = () => { setEditId(null); form.reset({ title:"",subtitle:"",imageUrl:"",linkUrl:"",isActive:true,sortOrder:"0" }); setOpen(true); };
  const openEdit = (b: { id:number;title:string;subtitle?:string|null;imageUrl:string;linkUrl?:string|null;isActive:boolean;sortOrder:number }) => {
    setEditId(b.id);
    form.reset({ title:b.title, subtitle:b.subtitle??"", imageUrl:b.imageUrl, linkUrl:b.linkUrl??"", isActive:b.isActive, sortOrder:String(b.sortOrder) });
    setOpen(true);
  };

  const onSubmit = (data: BannerForm) => {
    const payload = { title:data.title, subtitle:data.subtitle||null, imageUrl:data.imageUrl, linkUrl:data.linkUrl||null, isActive:data.isActive, sortOrder:Number(data.sortOrder) };
    if (editId) update.mutate({ id: editId, data: payload });
    else create.mutate({ data: payload });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-serif font-bold">Banners</h1><p className="text-sm text-muted-foreground">Manage homepage hero banners.</p></div>
          <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4"/>Add Banner</Button>
        </div>
        {isLoading ? <div className="space-y-3">{[1,2].map(i=><Skeleton key={i} className="h-24"/>)}</div>
          : !banners?.length ? <div className="text-center py-16 text-muted-foreground"><Image className="h-10 w-10 mx-auto mb-3 opacity-30"/><p>No banners yet.</p></div>
          : <div className="space-y-3">
              {banners.map(b => (
                <Card key={b.id}><CardContent className="p-4 flex items-center gap-4">
                  <img src={b.imageUrl} alt={b.title} className="w-24 h-16 rounded-lg object-cover shrink-0" onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{b.title}</p>
                    {b.subtitle && <p className="text-xs text-muted-foreground truncate">{b.subtitle}</p>}
                    <p className="text-xs text-muted-foreground">Sort: {b.sortOrder} · {b.isActive ? <span className="text-green-600">Active</span> : <span className="text-muted-foreground">Inactive</span>}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="h-4 w-4"/></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if(confirm("Delete?")) del.mutate({ id: b.id }); }}><Trash2 className="h-4 w-4"/></Button>
                  </div>
                </CardContent></Card>
              ))}
            </div>
        }
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editId ? "Edit Banner" : "New Banner"}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>)} />
              <FormField control={form.control} name="subtitle" render={({ field }) => (<FormItem><FormLabel>Subtitle</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>)} />
              <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field}/></FormControl></FormItem>)} />
              <FormField control={form.control} name="linkUrl" render={({ field }) => (<FormItem><FormLabel>Link URL (optional)</FormLabel><FormControl><Input placeholder="/shop" {...field}/></FormControl></FormItem>)} />
              <FormField control={form.control} name="sortOrder" render={({ field }) => (<FormItem><FormLabel>Sort Order</FormLabel><FormControl><Input type="number" {...field}/></FormControl></FormItem>)} />
              <FormField control={form.control} name="isActive" render={({ field }) => (<FormItem className="flex items-center gap-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl><FormLabel>Active</FormLabel></FormItem>)} />
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1" disabled={create.isPending||update.isPending}>{editId ? "Save" : "Create"}</Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
