import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useGetAdminMe } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, Phone, Store, Clock, Package } from "lucide-react";

interface StoreSettings {
  whatsappNumber: string;
  storeName: string;
  storeTagline: string;
  storeAddress: string;
  minLeadHours: string;
  dailyOrderLimit: string;
}

export default function AdminSettingsPage() {
  const [, navigate] = useLocation();
  const { data: session, isLoading: loadingSession } = useGetAdminMe();
  const { toast } = useToast();
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loadingSession && !session?.authenticated) navigate("/admin/login");
  }, [session, loadingSession]);

  useEffect(() => {
    fetch("/api/admin/settings", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        toast({ title: "✅ Settings saved!", description: "Store settings updated successfully." });
      } else {
        toast({ title: "Error saving settings", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error saving settings", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof StoreSettings, value: string) => {
    setSettings((s) => s ? { ...s, [key]: value } : s);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" /> Store Settings
            </h1>
            <p className="text-sm text-muted-foreground">Configure your bakery store details.</p>
          </div>
          <Button onClick={handleSave} disabled={saving || loading} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : settings ? (
          <>
            {/* WhatsApp */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-600" /> WhatsApp Orders
                </CardTitle>
                <CardDescription>
                  آرڈرز اس نمبر پر WhatsApp میں بھیجے جائیں گے۔
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label>WhatsApp نمبر (country code کے ساتھ)</Label>
                  <Input
                    value={settings.whatsappNumber}
                    onChange={(e) => update("whatsappNumber", e.target.value)}
                    placeholder="923001234567"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground">
                    مثال: <code className="bg-muted px-1 rounded">923001234567</code> (0300 1234567 کے لیے)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Store Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Store className="h-4 w-4 text-primary" /> Store Information
                </CardTitle>
                <CardDescription>یہ معلومات website پر دکھائی جاتی ہیں۔</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Store Name</Label>
                  <Input
                    value={settings.storeName}
                    onChange={(e) => update("storeName", e.target.value)}
                    placeholder="Bake Delight Pro"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Tagline</Label>
                  <Input
                    value={settings.storeTagline}
                    onChange={(e) => update("storeTagline", e.target.value)}
                    placeholder="Handcrafted with love..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Address</Label>
                  <Input
                    value={settings.storeAddress}
                    onChange={(e) => update("storeAddress", e.target.value)}
                    placeholder="Karachi, Pakistan"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Settings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" /> آرڈر کی ترتیبات
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Minimum Lead Time (گھنٹے)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={settings.minLeadHours}
                    onChange={(e) => update("minLeadHours", e.target.value)}
                    placeholder="24"
                  />
                  <p className="text-xs text-muted-foreground">آرڈر سے ڈیلیوری تک کم از کم وقت</p>
                </div>
                <div className="space-y-1.5">
                  <Label>روزانہ آرڈر کی حد</Label>
                  <Input
                    type="number"
                    min="1"
                    value={settings.dailyOrderLimit}
                    onChange={(e) => update("dailyOrderLimit", e.target.value)}
                    placeholder="20"
                  />
                  <p className="text-xs text-muted-foreground">ایک دن میں زیادہ سے زیادہ آرڈرز</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-2">
              <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save All Settings"}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Settings load نہیں ہو سکیں۔ دوبارہ کوشش کریں۔</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
