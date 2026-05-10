import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { useLanguage, getLocalizedText } from "@/lib/i18n/LanguageContext";

export default function AdminPlaceholderPage() {
  const { isUrdu } = useLanguage();
  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center h-[80vh] px-4">
        <Card className="w-full max-w-md border-dashed border-2 shadow-none bg-transparent">
          <CardContent className="pt-10 pb-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Wrench className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
              {getLocalizedText("Under Development | زیرِ تعمیر", isUrdu)}
            </h2>
            <p className="text-muted-foreground text-sm">
              {getLocalizedText(
                "This module is currently being built and will be available in the next update. Thank you for your patience! | یہ ماڈیول فی الحال زیرِ تعمیر ہے اور اگلی اپڈیٹ میں دستیاب ہوگا۔ آپ کے صبر کا شکریہ!",
                isUrdu
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
