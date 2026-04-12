import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/lib/auth";
import { fetchProfile, upsertProfile, type ProfileRow } from "@/lib/supabaseProfile";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Loader2, User, Building } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const jobSeekerSchema = z.object({
  bio: z.string().optional(),
  location: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  skills: z.string().transform((val) => val.split(",").map((s) => s.trim()).filter(Boolean)),
  experience: z.string().optional(),
  education: z.string().optional(),
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const employerSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyWebsite: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  industry: z.string().optional(),
  location: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  bio: z.string().optional(),
});

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isEmployer = user?.role === "employer";
  const schema = isEmployer ? employerSchema : jobSeekerSchema;

  const form = useForm({
    resolver: zodResolver(schema as never),
    defaultValues: {
      bio: "",
      location: "",
      country: "",
      skills: "",
      experience: "",
      education: "",
      linkedinUrl: "",
      companyName: "",
      companyWebsite: "",
      industry: "",
    },
  });

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const row = await fetchProfile(user.id);
      if (cancelled) return;
      if (row) {
        form.reset({
          bio: row.bio || "",
          location: row.location || "",
          country: row.country || "",
          skills: (row.skills || []).join(", "),
          experience: row.experience || "",
          education: row.education || "",
          linkedinUrl: row.linkedin_url || "",
          companyName: row.company_name || "",
          companyWebsite: row.company_website || "",
          industry: row.industry || "",
        });
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, form]);

  const onSubmit = async (data: z.infer<typeof jobSeekerSchema> | z.infer<typeof employerSchema>) => {
    if (!user) return;
    setSaving(true);
    try {
      const base: Partial<ProfileRow> & { id: string } = { id: user.id };
      if (isEmployer) {
        const d = data as z.infer<typeof employerSchema>;
        await upsertProfile({
          ...base,
          company_name: d.companyName,
          company_website: d.companyWebsite || null,
          industry: d.industry || null,
          location: d.location || null,
          country: d.country,
          bio: d.bio || null,
        });
      } else {
        const d = data as z.infer<typeof jobSeekerSchema>;
        await upsertProfile({
          ...base,
          bio: d.bio || null,
          location: d.location || null,
          country: d.country,
          skills: d.skills,
          experience: d.experience || null,
          education: d.education || null,
          linkedin_url: d.linkedinUrl || null,
        });
      }
      toast({ title: "Profile updated", description: "Your profile has been saved successfully." });
    } catch {
      toast({ variant: "destructive", title: "Update failed", description: "Could not save to your account." });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          {isEmployer ? "Manage your company's public profile." : "Update your professional details to stand out to employers."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isEmployer ? <Building className="h-5 w-5" /> : <User className="h-5 w-5" />}
                {isEmployer ? "Company Information" : "Basic Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEmployer ? (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Technology, Finance" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="companyWebsite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills (comma separated)</FormLabel>
                        <FormControl>
                          <Input placeholder="React, TypeScript, Node.js" {...field} />
                        </FormControl>
                        <FormDescription>These help employers and our matching tools understand your strengths.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="linkedinUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/in/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City / State</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Lagos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Nigeria" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEmployer ? "Company Description" : "Professional Summary"}</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[120px]" placeholder="Tell us about yourself..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isEmployer && (
                <>
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Summary</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-[100px]" placeholder="Brief overview of your work history..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. BSc Computer Science, University of Lagos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-4">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
