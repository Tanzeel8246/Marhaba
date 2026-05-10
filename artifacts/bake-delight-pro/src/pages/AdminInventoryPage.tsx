import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, Plus, Filter, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { useLanguage, getLocalizedText } from "@/lib/i18n/LanguageContext";

// Mock data for inventory
const MOCK_INVENTORY = [
  { id: 1, name: "Premium Flour (50kg)", category: "Ingredients", stock: 12, unit: "Bags", minStock: 5, price: 5500, lastUpdated: "2023-10-24" },
  { id: 2, name: "Unsalted Butter", category: "Dairy", stock: 3, unit: "kg", minStock: 10, price: 1800, lastUpdated: "2023-10-25" },
  { id: 3, name: "Dark Chocolate Chips", category: "Ingredients", stock: 15, unit: "kg", minStock: 10, price: 2200, lastUpdated: "2023-10-20" },
  { id: 4, name: "Caster Sugar", category: "Ingredients", stock: 20, unit: "kg", minStock: 15, price: 150, lastUpdated: "2023-10-21" },
  { id: 5, name: "Cake Boxes (10x10)", category: "Packaging", stock: 150, unit: "pcs", minStock: 50, price: 45, lastUpdated: "2023-10-22" },
  { id: 6, name: "Cupcake Liners", category: "Packaging", stock: 45, unit: "pkts", minStock: 100, price: 120, lastUpdated: "2023-10-18" },
];

export default function AdminInventoryPage() {
  const { isUrdu } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredInventory = MOCK_INVENTORY.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">{getLocalizedText("Inventory Management | انوینٹری مینجمنٹ", isUrdu)}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{getLocalizedText("Track raw materials, ingredients, and packaging stock. | خام مال، اجزاء اور پیکیجنگ اسٹاک کو ٹریک کریں۔", isUrdu)}</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> {getLocalizedText("Add Item | آئٹم شامل کریں", isUrdu)}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{getLocalizedText("Total Items | کل اشیاء", isUrdu)}</p>
                <h3 className="text-2xl font-bold">{MOCK_INVENTORY.length}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{getLocalizedText("Low Stock Alerts | کم اسٹاک الرٹس", isUrdu)}</p>
                <h3 className="text-2xl font-bold">{MOCK_INVENTORY.filter(i => i.stock <= i.minStock).length}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center shrink-0">
                <span className="font-serif font-bold text-xl">₨</span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{getLocalizedText("Inventory Value | انوینٹری کی مالیت", isUrdu)}</p>
                <h3 className="text-2xl font-bold">
                  {formatCurrency(MOCK_INVENTORY.reduce((acc, i) => acc + (i.stock * i.price), 0))}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
            <CardTitle className="text-lg">{getLocalizedText("Stock Levels | اسٹاک کی سطح", isUrdu)}</CardTitle>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={getLocalizedText("Search items... | اشیاء تلاش کریں...", isUrdu)} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">{getLocalizedText("Item Name | آئٹم کا نام", isUrdu)}</th>
                    <th className="px-6 py-4">{getLocalizedText("Category | کیٹیگری", isUrdu)}</th>
                    <th className="px-6 py-4">{getLocalizedText("Stock | اسٹاک", isUrdu)}</th>
                    <th className="px-6 py-4">{getLocalizedText("Unit Price | یونٹ کی قیمت", isUrdu)}</th>
                    <th className="px-6 py-4">{getLocalizedText("Value | مالیت", isUrdu)}</th>
                    <th className="px-6 py-4">{getLocalizedText("Status | صورتحال", isUrdu)}</th>
                    <th className="px-6 py-4 text-right">{getLocalizedText("Actions | اعمال", isUrdu)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInventory.map((item) => {
                    const isLowStock = item.stock <= item.minStock;
                    return (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium">{item.name}</td>
                        <td className="px-6 py-4">
                          <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{item.stock} {item.unit}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{formatCurrency(item.price)}</td>
                        <td className="px-6 py-4 font-medium">{formatCurrency(item.stock * item.price)}</td>
                        <td className="px-6 py-4">
                          {isLowStock ? (
                            <span className="flex items-center gap-1 text-destructive text-xs font-bold bg-destructive/10 px-2 py-1 rounded-full w-fit">
                              <AlertTriangle className="h-3 w-3" /> {getLocalizedText("Low Stock | کم اسٹاک", isUrdu)}
                            </span>
                          ) : (
                            <span className="text-green-600 dark:text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full w-fit block">
                              {getLocalizedText("In Stock | دستیاب", isUrdu)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" className="text-primary">{getLocalizedText("Update | اپڈیٹ", isUrdu)}</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredInventory.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>{getLocalizedText("No inventory items found. | کوئی انوینٹری آئٹمز نہیں ملے۔", isUrdu)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
