import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminLogin, useGetAdminMe } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({ password: z.string().min(1, "Password required") });

export default function AdminLoginPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();
  const { data: session } = useGetAdminMe();

  useEffect(() => {
    if (session?.authenticated) navigate("/admin");
  }, [session]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "" },
  });

  const login = useAdminLogin({
    mutation: {
      onSuccess: (data) => {
        if (data.success) {
          queryClient.invalidateQueries();
          navigate("/admin");
        } else {
          toast({ title: "Login failed", description: data.message, variant: "destructive" });
        }
      },
      onError: () => {
        toast({ title: "Incorrect password", variant: "destructive" });
      },
    },
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary">Bake Delight Pro</h1>
          <p className="text-muted-foreground mt-1">Admin Portal</p>
        </div>
        <Card>
          <CardHeader className="pb-4">
            <div className="mx-auto mb-3 bg-primary/10 rounded-full p-3 w-fit">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-center text-xl">Welcome back</CardTitle>
            <CardDescription className="text-center">Enter your admin password to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => login.mutate({ data: v }))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter admin password" data-testid="input-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={login.isPending} data-testid="button-submit">
                  {login.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
            <p className="text-center text-xs text-muted-foreground mt-4">Default password: admin123</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
