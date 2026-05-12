import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage, getLocalizedText } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Table as TableIcon, Edit, Trash2, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const API_MAP: Record<string, string> = {
  "/admin/customers": "/api/admin/customers",
  "/admin/suppliers": "/api/admin/suppliers",
  "/admin/purchases": "/api/admin/purchases",
  "/admin/expenses": "/api/admin/expenses",
  "/admin/cash-book": "/api/admin/cash-book",
  "/admin/reviews": "/api/admin/reviews",
  "/admin/loyalty": "/api/admin/loyalty",
  "/admin/wastage": "/api/admin/wastage",
  "/admin/special-moments": "/api/admin/special-moments",
};

const TITLES: Record<string, string> = {
  "/admin/customers": "Customers Management | کسٹمرز مینجمنٹ",
  "/admin/suppliers": "Suppliers Directory | سپلائرز کی فہرست",
  "/admin/purchases": "Purchase Orders | خریداری کے آرڈرز",
  "/admin/expenses": "Expenses Tracking | اخراجات کا ریکارڈ",
  "/admin/reporting": "Reporting Hub | رپورٹس کا مرکز",
  "/admin/cash-book": "Cash Book | کیش بک",
  "/admin/reviews": "Customer Reviews | کسٹمرز کے ریویوز",
  "/admin/loyalty": "Loyalty Program | لائلٹی پروگرام",
  "/admin/wastage": "Wastage Management | ضیاع کا انتظام",
  "/admin/special-moments": "Special Moments | خاص لمحات",
};

export default function AdminGenericModulePage() {
  const { isUrdu } = useLanguage();
  const [location] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleData, setModuleData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const apiPath = API_MAP[location];
    if (!apiPath) {
      setModuleData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(apiPath, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setModuleData(data);
      } else {
        toast({ title: "Error fetching data", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  const title = TITLES[location] || "Module | ماڈیول";
  const columns = moduleData.length > 0 ? Object.keys(moduleData[0]).filter(k => !["id", "createdAt", "updatedAt", "supplierId", "productId"].includes(k)) : [];

  const handleOpenAdd = () => {
    setEditingItem(null);
    const initialForm: Record<string, string> = {};
    columns.forEach(col => initialForm[col] = "");
    setFormData(initialForm);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    const initialForm: Record<string, string> = {};
    columns.forEach(col => initialForm[col] = String(item[col] ?? ""));
    setFormData(initialForm);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: any) => {
    if (!confirm(getLocalizedText("Are you sure? | کیا آپ واقعی حذف کرنا چاہتے ہیں؟", isUrdu))) return;
    
    const apiPath = `${API_MAP[location]}/${id}`;
    try {
      const res = await fetch(apiPath, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        setModuleData(prev => prev.filter(item => item.id !== id));
        toast({ title: "Deleted", description: "Record removed successfully." });
      } else {
        toast({ title: "Delete failed", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const apiPath = API_MAP[location];
    const method = editingItem ? "PUT" : "POST";
    const url = editingItem ? `${apiPath}/${editingItem.id}` : apiPath;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      if (res.ok) {
        fetchData();
        setIsDialogOpen(false);
        toast({ title: "Success", description: "Record saved successfully." });
      } else {
        const err = await res.json();
        toast({ title: "Save failed", description: err.error || "Unknown error", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const filteredData = moduleData.filter(item => 
    Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            {getLocalizedText(title, isUrdu)}
          </h1>
          <Button onClick={handleOpenAdd} className="shrink-0 gap-2 font-bold uppercase tracking-wider text-xs">
            <Plus className="h-4 w-4" />
            {getLocalizedText("Add New | نیا شامل کریں", isUrdu)}
          </Button>
        </div>

        <Card className="border-border/50 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-muted/20 flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={getLocalizedText("Search records... | ریکارڈ تلاش کریں...", isUrdu)}
                className="pl-9 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Loading real-time data...</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/40 text-muted-foreground font-semibold">
                  <tr>
                    {columns.map((col) => (
                      <th key={col} className="px-6 py-4">{col.replace(/([A-Z])/g, ' $1').trim()}</th>
                    ))}
                    <th className="px-6 py-4 text-right">{getLocalizedText("Actions | اعمال", isUrdu)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-muted-foreground">
                        <TableIcon className="h-10 w-10 mx-auto mb-3 opacity-20" />
                        {getLocalizedText("No records found. | کوئی ریکارڈ نہیں ملا۔", isUrdu)}
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                        {columns.map((col) => (
                          <td key={col} className="px-6 py-4 font-medium">
                            {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? "-")}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button onClick={() => handleOpenEdit(row)} variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => handleDelete(row.id)} variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
          <div className="p-4 border-t border-border/50 bg-muted/20 text-xs text-muted-foreground text-center font-medium">
            {getLocalizedText("Real-time database connection active. | ڈیٹا بیس سے براہ راست منسلک۔", isUrdu)}
          </div>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? getLocalizedText("Edit Record | ریکارڈ ترمیم کریں", isUrdu) : getLocalizedText("Add New Record | نیا ریکارڈ شامل کریں", isUrdu)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {columns.map(col => (
              <div key={col} className="space-y-2">
                <label className="text-sm font-medium leading-none capitalize">
                  {col.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <Input 
                  value={formData[col] || ""} 
                  onChange={(e) => setFormData(prev => ({ ...prev, [col]: e.target.value }))}
                  placeholder={`Enter ${col}...`}
                />
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
              {getLocalizedText("Cancel | منسوخ کریں", isUrdu)}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {getLocalizedText("Save | محفوظ کریں", isUrdu)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
