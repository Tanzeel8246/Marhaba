import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Plus, Search, Calendar as CalendarIcon, ArrowDownRight, PackageX, TrendingDown, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatCurrency } from "@/lib/currency";
import { useLanguage, getLocalizedText } from "@/lib/i18n/LanguageContext";

// Mock data for wastage
const MOCK_WASTAGE = [
  { id: 1, date: "2023-10-25", item: "Croissants", quantity: 5, unit: "pcs", reason: "End of day expired", costPerUnit: 250, reportedBy: "Ali" },
  { id: 2, date: "2023-10-24", item: "Milk", quantity: 2, unit: "Liters", reason: "Spoiled", costPerUnit: 300, reportedBy: "Sara" },
  { id: 3, date: "2023-10-23", item: "Chocolate Cake", quantity: 1, unit: "pcs", reason: "Damaged in handling", costPerUnit: 2500, reportedBy: "Omar" },
  { id: 4, date: "2023-10-23", item: "Bread Loaves", quantity: 3, unit: "pcs", reason: "Quality check failed (burnt)", costPerUnit: 150, reportedBy: "Kitchen Lead" },
];

const ANALYTICS_DATA = [
  { day: "Mon", cost: 1200 },
  { day: "Tue", cost: 2100 },
  { day: "Wed", cost: 800 },
  { day: "Thu", cost: 2900 },
  { day: "Fri", cost: 1500 },
  { day: "Sat", cost: 3500 },
  { day: "Sun", cost: 1800 },
];

export default function AdminWastagePage() {
  const { isUrdu } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWastage = MOCK_WASTAGE.filter(item => 
    item.item.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalWastageCost = MOCK_WASTAGE.reduce((acc, item) => acc + (item.quantity * item.costPerUnit), 0);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight text-destructive flex items-center gap-2">
              <AlertCircle className="w-8 h-8" /> {getLocalizedText("Wastage Log | ضیاع کا ریکارڈ", isUrdu)}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">{getLocalizedText("Monitor and log inventory and food wastage. | انوینٹری اور کھانے کے ضیاع کی نگرانی اور ریکارڈ کریں۔", isUrdu)}</p>
          </div>
          <Button variant="destructive" className="gap-2">
            <Plus className="h-4 w-4" /> {getLocalizedText("Log Wastage | ضیاع درج کریں", isUrdu)}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-bold text-destructive uppercase tracking-widest">{getLocalizedText("Total Wastage Cost | کل ضائع شدہ قیمت", isUrdu)}</p>
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <ArrowDownRight className="w-4 h-4 text-destructive" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-destructive">{formatCurrency(totalWastageCost)}</h3>
              <p className="text-xs text-muted-foreground mt-2 font-medium">{getLocalizedText("Last 7 days | گزشتہ 7 دن", isUrdu)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{getLocalizedText("Items Wasted | ضائع شدہ اشیاء", isUrdu)}</p>
                <div className="p-2 bg-muted rounded-lg">
                  <PackageX className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-3xl font-bold">{MOCK_WASTAGE.length}</h3>
              <p className="text-xs text-muted-foreground mt-2 font-medium">{getLocalizedText("Recorded incidents | ریکارڈ شدہ واقعات", isUrdu)}</p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-sm uppercase tracking-wider">{getLocalizedText("Wastage Trend | ضیاع کا رجحان", isUrdu)}</h3>
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{getLocalizedText("Weekly | ہفتہ وار", isUrdu)}</span>
               </div>
               <div className="h-[80px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ANALYTICS_DATA}>
                      <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                        {ANALYTICS_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 5 ? "hsl(var(--destructive))" : "hsl(var(--primary))"} fillOpacity={index === 5 ? 1 : 0.4} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
            <CardTitle className="text-lg">{getLocalizedText("Recent Logs | حالیہ ریکارڈ", isUrdu)}</CardTitle>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={getLocalizedText("Search item or reason... | آئٹم یا وجہ تلاش کریں...", isUrdu)} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">{getLocalizedText("Date | تاریخ", isUrdu)}</th>
                    <th className="px-6 py-4">{getLocalizedText("Item | آئٹم", isUrdu)}</th>
                    <th className="px-6 py-4">{getLocalizedText("Quantity | مقدار", isUrdu)}</th>
                    <th className="px-6 py-4">{getLocalizedText("Reason | وجہ", isUrdu)}</th>
                    <th className="px-6 py-4">{getLocalizedText("Reported By | رپورٹ کنندہ", isUrdu)}</th>
                    <th className="px-6 py-4 text-right">{getLocalizedText("Cost Loss | نقصان", isUrdu)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredWastage.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{item.date}</td>
                      <td className="px-6 py-4 font-bold">{item.item}</td>
                      <td className="px-6 py-4 font-medium">{item.quantity} {item.unit}</td>
                      <td className="px-6 py-4 text-muted-foreground">{item.reason}</td>
                      <td className="px-6 py-4">{item.reportedBy}</td>
                      <td className="px-6 py-4 text-right font-bold text-destructive">
                        {formatCurrency(item.quantity * item.costPerUnit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredWastage.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>{getLocalizedText("No wastage logs found. | ضیاع کا کوئی ریکارڈ نہیں ملا۔", isUrdu)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
