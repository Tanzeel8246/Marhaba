import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Star, History, MessageSquare, Phone } from "lucide-react";
import { useLanguage, getLocalizedText } from "@/lib/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";

// Mock data for customers with loyalty points
const MOCK_CUSTOMERS = [
  { id: 1, name: "Ali Ahmed", phone: "03001234567", email: "ali@example.com", loyaltyPoints: 450, lastOrder: "2023-10-25", totalOrders: 12 },
  { id: 2, name: "Sara Khan", phone: "03217654321", email: "sara@example.com", loyaltyPoints: 120, lastOrder: "2023-10-24", totalOrders: 3 },
  { id: 3, name: "Omar Farooq", phone: "03339876543", email: "omar@example.com", loyaltyPoints: 890, lastOrder: "2023-10-22", totalOrders: 25 },
  { id: 4, name: "Fatima Noor", phone: "03451122334", email: "fatima@example.com", loyaltyPoints: 50, lastOrder: "2023-10-20", totalOrders: 1 },
];

export default function AdminCustomersPage() {
  const { isUrdu } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight flex items-center gap-2">
              <Users className="w-8 h-8 text-primary" /> {getLocalizedText("Customers | کسٹمرز", isUrdu)}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">{getLocalizedText("Manage loyalty points and customer relationships. | لائلٹی پوائنٹس اور کسٹمر تعلقات کا انتظام کریں۔", isUrdu)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">{getLocalizedText("Top Loyal Customer | سب سے وفادار کسٹمر", isUrdu)}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">O</div>
                <div>
                  <h3 className="font-bold text-lg">Omar Farooq</h3>
                  <p className="text-xs text-muted-foreground">890 {getLocalizedText("Points | پوائنٹس", isUrdu)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">{getLocalizedText("Total Customers | کل کسٹمرز", isUrdu)}</p>
              <h3 className="text-3xl font-bold">{MOCK_CUSTOMERS.length}</h3>
              <p className="text-xs text-muted-foreground mt-2 font-medium">+2 {getLocalizedText("this week | اس ہفتے", isUrdu)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">{getLocalizedText("Avg Loyalty Points | اوسط پوائنٹس", isUrdu)}</p>
              <h3 className="text-3xl font-bold">377</h3>
              <p className="text-xs text-muted-foreground mt-2 font-medium">{getLocalizedText("Across all members | تمام ممبران میں", isUrdu)}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
            <CardTitle className="text-lg">{getLocalizedText("Customer List | کسٹمر لسٹ", isUrdu)}</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={getLocalizedText("Search name or phone... | نام یا فون تلاش کریں...", isUrdu)} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">{getLocalizedText("Customer | کسٹمر", isUrdu)}</th>
                    <th className="px-6 py-4">{getLocalizedText("Loyalty Level | لیول", isUrdu)}</th>
                    <th className="px-6 py-4">{getLocalizedText("Points | پوائنٹس", isUrdu)}</th>
                    <th className="px-6 py-4">{getLocalizedText("Total Orders | آرڈرز", isUrdu)}</th>
                    <th className="px-6 py-4 text-right">{getLocalizedText("Actions | کارروائی", isUrdu)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        {c.loyaltyPoints > 500 ? (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Gold</Badge>
                        ) : c.loyaltyPoints > 200 ? (
                          <Badge className="bg-slate-100 text-slate-800 border-slate-200">Silver</Badge>
                        ) : (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">Bronze</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-primary">{c.loyaltyPoints}</td>
                      <td className="px-6 py-4">{c.totalOrders}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View History"><History className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" title="Send WhatsApp" onClick={() => window.open(`https://wa.me/${c.phone}`)}><MessageSquare className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
