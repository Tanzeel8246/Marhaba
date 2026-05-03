import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useListBlackoutDates, useCreateBlackoutDate, useDeleteBlackoutDate, useGetAdminMe } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Ban } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminBlackoutDatesPage() {
  const [, navigate] = useLocation();
  const { data: session, isLoading: loadingSession } = useGetAdminMe();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!loadingSession && !session?.authenticated) navigate("/admin/login");
  }, [session, loadingSession]);

  const { data: dates, isLoading } = useListBlackoutDates();
  const form = useForm<{ date: string; reason: string }>({ defaultValues: { date: "", reason: "" } });

  const create = useCreateBlackoutDate({ mutation: { onSuccess: () => { queryClient.invalidateQueries(); form.reset(); toast({ title: "Blackout date added" }); } } });
  const del = useDeleteBlackoutDate({ mutation: { onSuccess: () => { queryClient.invalidateQueries(); toast({ title: "Blackout date removed" }); } } });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-serif font-bold">Blackout Dates</h1><p className="text-sm text-muted-foreground">Mark dates as unavailable for delivery.</p></div>

        <Card>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(d => create.mutate({ data: { date: d.date, reason: d.reason || null } }))} className="flex flex-col sm:flex-row gap-3">
                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem className="flex-1"><FormLabel>Date</FormLabel><FormControl><Input type="date" required {...field}/></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="reason" render={({ field }) => (
                  <FormItem className="flex-1"><FormLabel>Reason (optional)</FormLabel><FormControl><Input placeholder="Holiday, event..." {...field}/></FormControl></FormItem>
                )} />
                <div className="flex items-end">
                  <Button type="submit" disabled={create.isPending} className="gap-2 w-full sm:w-auto"><Plus className="h-4 w-4"/>Block Date</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading ? <div className="space-y-2">{[1,2,3].map(i=><Skeleton key={i} className="h-14"/>)}</div>
          : !dates?.length ? <div className="text-center py-12 text-muted-foreground"><Ban className="h-10 w-10 mx-auto mb-3 opacity-30"/><p>No blackout dates set.</p></div>
          : <div className="space-y-2">
              {dates.map(d => (
                <Card key={d.id}><CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{d.date}</p>
                    {d.reason && <p className="text-sm text-muted-foreground">{d.reason}</p>}
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => del.mutate({ id: d.id })}><Trash2 className="h-4 w-4"/></Button>
                </CardContent></Card>
              ))}
            </div>
        }
      </div>
    </AdminLayout>
  );
}
