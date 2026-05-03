import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useListCoupons, useCreateCoupon, useDeleteCoupon, useGetAdminMe } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Ticket } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/currency";

interface CouponForm { code: string; discountType: string; discountValue: string; minOrderAmount: string; maxUses: string; isActive: boolean; expiresAt: string }

export default function AdminCouponsPage() {
  const [, navigate] = useLocation();
  const { data: session, isLoading: loadingSession } = useGetAdminMe();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loadingSession && !session?.authenticated) navigate("/admin/login");
  }, [session, loadingSession]);

  const { data: coupons, isLoading } = useListCoupons();
  const form = useForm<CouponForm>({ defaultValues: { code:"", discountType:"percentage", discountValue:"", minOrderAmount:"", maxUses:"", isActive:true, expiresAt:"" } });

  const create = useCreateCoupon({ mutation: { onSuccess: () => { queryClient.invalidateQueries(); setOpen(false); toast({ title: "Coupon created" }); } } });
  const del = useDeleteCoupon({ mutation: { onSuccess: () => { queryClient.invalidateQueries(); toast({ title: "Coupon deleted" }); } } });

  const onSubmit = (data: CouponForm) => {
    create.mutate({ data: {
      code: data.code.toUpperCase(),
      discountType: data.discountType as "percentage" | "fixed",
      discountValue: Number(data.discountValue),
      minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : null,
      maxUses: data.maxUses ? Number(data.maxUses) : null,
      isActive: data.isActive,
      expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
    }});
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-serif font-bold">Coupons</h1><p className="text-sm text-muted-foreground">Manage discount codes.</p></div>
          <Button onClick={() => { form.reset(); setOpen(true); }} className="gap-2"><Plus className="h-4 w-4"/>New Coupon</Button>
        </div>

        {isLoading ? <div className="space-y-2">{[1,2,3].map(i=><Skeleton key={i} className="h-16"/>)}</div>
          : !coupons?.length ? <div className="text-center py-12 text-muted-foreground"><Ticket className="h-10 w-10 mx-auto mb-3 opacity-30"/><p>No coupons yet.</p></div>
          : <div className="space-y-3">
              {coupons.map(c => (
                <Card key={c.id}><CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm bg-muted px-2 py-0.5 rounded">{c.code}</span>
                      <Badge variant={c.isActive ? "default" : "secondary"} className="text-xs">{c.isActive ? "Active" : "Inactive"}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {c.discountType === "percentage" ? `${Number(c.discountValue)}% off` : `${formatCurrency(Number(c.discountValue))} off`}
                      {c.minOrderAmount && ` · Min ${formatCurrency(Number(c.minOrderAmount))}`}
                      {c.maxUses && ` · ${c.usedCount}/${c.maxUses} uses`}
                      {!c.maxUses && ` · ${c.usedCount} uses`}
                    </p>
                    {c.expiresAt && <p className="text-xs text-muted-foreground">Expires: {new Date(c.expiresAt).toLocaleDateString()}</p>}
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if(confirm("Delete coupon?")) del.mutate({ id: c.id }); }}><Trash2 className="h-4 w-4"/></Button>
                </CardContent></Card>
              ))}
            </div>
        }
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Coupon</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <FormField control={form.control} name="code" render={({ field }) => (<FormItem><FormLabel>Code</FormLabel><FormControl><Input placeholder="SAVE10" {...field} onChange={e => field.onChange(e.target.value.toUpperCase())}/></FormControl></FormItem>)} />
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="discountType" render={({ field }) => (
                  <FormItem><FormLabel>Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="discountValue" render={({ field }) => (<FormItem><FormLabel>Value</FormLabel><FormControl><Input type="number" step="0.01" placeholder="10" required {...field}/></FormControl></FormItem>)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="minOrderAmount" render={({ field }) => (<FormItem><FormLabel>Min Order (Rs.)</FormLabel><FormControl><Input type="number" step="1" placeholder="0" {...field}/></FormControl></FormItem>)} />
                <FormField control={form.control} name="maxUses" render={({ field }) => (<FormItem><FormLabel>Max Uses</FormLabel><FormControl><Input type="number" placeholder="Unlimited" {...field}/></FormControl></FormItem>)} />
              </div>
              <FormField control={form.control} name="expiresAt" render={({ field }) => (<FormItem><FormLabel>Expires At (optional)</FormLabel><FormControl><Input type="datetime-local" {...field}/></FormControl></FormItem>)} />
              <FormField control={form.control} name="isActive" render={({ field }) => (<FormItem className="flex items-center gap-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl><FormLabel>Active</FormLabel></FormItem>)} />
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1" disabled={create.isPending}>Create Coupon</Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
