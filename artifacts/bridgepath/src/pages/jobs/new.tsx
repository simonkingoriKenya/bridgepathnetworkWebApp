import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateJob, CreateJobBodyType } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { getApiErrorMessage } from "@/lib/api-error";

const jobSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  requirements: z.string().min(10, "Requirements are required"),
  location: z.enum(["Ghana", "Kenya", "Remote"] as const),
  type: z.enum(["full_time", "part_time", "contract", "internship", "remote"] as const),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function PostJob() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const createJobMutation = useCreateJob();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema as never),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      location: "Ghana",
      type: "full_time",
    }
  });

  const onSubmit = (data: JobFormValues) => {
    const payload = {
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      location: data.location,
      country: data.location === "Remote" ? "Remote" : data.location,
      type: data.type as CreateJobBodyType,
      currency: "USD",
      industry: "",
      skills: [],
      isActive: true,
    };

    createJobMutation.mutate({
      data: payload
    }, {
      onSuccess: (job) => {
        toast({
          title: "Job Posted Successfully",
          description: "Your job listing is now live.",
        });
        setLocation(`/jobs/${job.id}`);
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Failed to post job",
          description: getApiErrorMessage(err, "There was an error creating the job listing."),
        });
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 py-8 px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/employer"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Post a New Job</h1>
          <p className="text-muted-foreground mt-1">Fill out the details to find the best African talent.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl><Input placeholder="e.g. Senior Frontend Engineer" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Ghana">Ghana</SelectItem>
                        <SelectItem value="Kenya">Kenya</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full_time">Full-time</SelectItem>
                        <SelectItem value="part_time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[150px]" placeholder="Describe the role..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="requirements" render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[100px]" placeholder="What are you looking for..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-4 justify-between">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/employer">Cancel</Link>
              </Button>
              <Button type="submit" disabled={createJobMutation.isPending}>
                {createJobMutation.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...</>
                ) : "Post Job"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}