import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage, getLocalizedText } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Table as TableIcon, Edit, Trash2, X } from "lucide-react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Initial generic mock data for different modules
const INITIAL_MOCK_DATA: Record<string, any[]> = {
  "/admin/customers": [
    { id: 1, name: "Ali Khan", phone: "0300-1234567", orders: 5, totalSpent: "Rs 4,500", status: "Active" },
    { id: 2, name: "Sara Ahmed", phone: "0321-7654321", orders: 2, totalSpent: "Rs 1,200", status: "Active" },
  ],
  "/admin/suppliers": [
    { id: 1, company: "Fresh Dairy Co.", contact: "Usman", phone: "0333-1112222", material: "Milk, Butter", balance: "Rs 15,000" },
    { id: 2, company: "Premium Flour Mills", contact: "Zafar", phone: "0311-9998888", material: "Flour, Yeast", balance: "Rs 0" },
  ],
  "/admin/purchases": [
    { id: "PO-1001", date: "2026-05-10", supplier: "Fresh Dairy Co.", amount: "Rs 5,000", status: "Received" },
    { id: "PO-1002", date: "2026-05-11", supplier: "Premium Flour Mills", amount: "Rs 12,000", status: "Pending" },
  ],
  "/admin/expenses": [
    { id: 1, date: "2026-05-09", category: "Utility", description: "Electricity Bill", amount: "Rs 25,000" },
    { id: 2, date: "2026-05-10", category: "Maintenance", description: "Oven Repair", amount: "Rs 8,000" },
  ],
  "/admin/cash-book": [
    { id: 1, date: "2026-05-10", type: "In", description: "Daily Counter Sales", amount: "Rs 45,000" },
    { id: 2, date: "2026-05-10", type: "Out", description: "Paid to Supplier", amount: "Rs 15,000" },
  ],
  "/admin/reviews": [
    { id: 1, customer: "Kamran", rating: "5 Stars", comment: "Amazing cake quality!", date: "2026-05-08", status: "Published" },
    { id: 2, customer: "Ayesha", rating: "4 Stars", comment: "Good taste but delivery was late.", date: "2026-05-09", status: "Pending Review" },
  ],
  "/admin/reporting": [
    { id: 1, report: "Monthly Sales Report", generated: "2026-05-01", size: "2.4 MB", type: "PDF" },
    { id: 2, report: "Tax Summary Q1", generated: "2026-04-15", size: "1.1 MB", type: "CSV" },
  ],
  "/admin/special-moments": [
    { id: 1, event: "Eid-ul-Fitr Prep", date: "2026-06-15", status: "Planning", budget: "Rs 100,000" },
    { id: 2, event: "Bakery Anniversary", date: "2026-08-20", status: "Draft", budget: "Rs 50,000" },
  ]
};

const TITLES: Record<string, string> = {
  "/admin/customers": "Customers Management | کسٹمرز مینجمنٹ",
  "/admin/suppliers": "Suppliers Directory | سپلائرز کی فہرست",
  "/admin/purchases": "Purchase Orders | خریداری کے آرڈرز",
  "/admin/expenses": "Expenses Tracking | اخراجات کا ریکارڈ",
  "/admin/reporting": "Reporting Hub | رپورٹس کا مرکز",
  "/admin/cash-book": "Cash Book | کیش بک",
  "/admin/reviews": "Customer Reviews | کسٹمرز کے ریویوز",
  "/admin/special-moments": "Special Moments | خاص لمحات",
};

export default function AdminGenericModulePage() {
  const { isUrdu } = useLanguage();
  const [location] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleData, setModuleData] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    setModuleData(INITIAL_MOCK_DATA[location] || []);
  }, [location]);

  const title = TITLES[location] || "Module | ماڈیول";
  const columns = moduleData.length > 0 ? Object.keys(moduleData[0]).filter(k => k !== "id") : [];

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
    columns.forEach(col => initialForm[col] = String(item[col]));
    setFormData(initialForm);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: any) => {
    if (confirm(getLocalizedText("Are you sure you want to delete this record? | کیا آپ واقعی اس ریکارڈ کو حذف کرنا چاہتے ہیں؟", isUrdu))) {
      setModuleData(prev => prev.filter(item => item.id !== id));
      toast({ title: getLocalizedText("Deleted | حذف کر دیا گیا", isUrdu), description: getLocalizedText("Record removed successfully. | ریکارڈ کامیابی کے ساتھ ہٹا دیا گیا۔", isUrdu) });
    }
  };

  const handleSave = () => {
    if (editingItem) {
      setModuleData(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...formData } : item));
      toast({ title: getLocalizedText("Updated | اپڈیٹ کر دیا گیا", isUrdu), description: getLocalizedText("Record updated successfully. | ریکارڈ کامیابی کے ساتھ اپڈیٹ ہو گیا۔", isUrdu) });
    } else {
      const newItem = { id: Date.now(), ...formData };
      setModuleData(prev => [newItem, ...prev]);
      toast({ title: getLocalizedText("Added | شامل کر دیا گیا", isUrdu), description: getLocalizedText("New record added successfully. | نیا ریکارڈ کامیابی کے ساتھ شامل ہو گیا۔", isUrdu) });
    }
    setIsDialogOpen(false);
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
                          {row[col]}
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
          </div>
          <div className="p-4 border-t border-border/50 bg-muted/20 text-xs text-muted-foreground text-center font-medium">
            {getLocalizedText("Showing latest records. Fully operational module. | تازہ ترین ریکارڈ دکھائے جا رہے ہیں۔", isUrdu)}
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
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize">
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {getLocalizedText("Cancel | منسوخ کریں", isUrdu)}
            </Button>
            <Button onClick={handleSave}>
              {getLocalizedText("Save | محفوظ کریں", isUrdu)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
