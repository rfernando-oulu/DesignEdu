"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFieldArray, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { createNewProgress } from "@/utils/api";
import ImageUpload from "@/components/ui/image-upload";
import { useState, useEffect } from "react";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
  youtube: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
  description: z.string().max(250).min(4),
  imageUrl: z
    .array(z.string().url({ message: "Please enter a valid URL." }))
    .min(1, { message: "At least one image URL is required." }), // Adjusted to array of strings (URLs)

  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

// This can come from your database or API.
const defaultValues: Partial<FormValues> = {
  title: "Week Three",

  urls: [{ value: "https://github.com/..." }],
  imageUrl: [],
  youtube: "https://youtube.com/...",
};

interface FormData {
  title: string;
  description: string;
  youtube?: string;
  imageUrl?: string[];
  embedUrl?: string;
  urls?: { value: string }[];
}

const Week = () => {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    const fetchLatestSubmission = async () => {
      try {
        const response = await fetch(`/api/latestSubmission?&week=3`);
        const data = await response.json();
        console.log(data.data);

        const youtubeUrl = data.data.content.youtube;
        const urlObj = new URL(youtubeUrl);
        const videoId = urlObj.searchParams.get("v");
        console.log(videoId);

        const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=1&end=0`;

        data.data.content.embedUrl = embedUrl;
        setFormData(data.data.content);
      } catch (error) {
        console.error("Error fetching latest submission:", error);
      }
    };

    fetchLatestSubmission();
  }, []);

  // 1. Define your form.
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append } = useFieldArray({
    name: "urls",
    control: form.control,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: FormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const postData = {
      week: 3,
      ...values,
    };

    console.log(postData);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(postData, null, 2)}
          </code>
        </pre>
      ),
    });

    await createNewProgress(postData);

    window.location.reload();
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormDescription>
                Title of the task
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="youtube"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Youtube URL" {...field} />
                </FormControl>
                <FormDescription>
                  Include the unlisted/public, NOT private YouTube link, for example: https://www.youtube.com/watch?v=h05IyxsxBaE
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about your progress"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can <span>@mention</span> task progress 
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={Array.isArray(field.value) ? field.value : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={(urlToRemove) =>
                      field.onChange(
                        field.value.filter((url) => url !== urlToRemove)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`urls.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Links
                    </FormLabel>
                    <FormDescription className={cn(index !== 0 && "sr-only")}>
                      Add links to your GitHub, Google Drive, or project URLs.
                    </FormDescription>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ value: "" })}
            >
              Add URL
            </Button>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <div>
        {formData ? (
          <>
            <div className="bg-gray-800 p-6 rounded-md space-y-6 mt-6">
              <section>
                <h1 className="text-white text-3xl font-bold mb-2">
                  {formData.title}
                </h1>{" "}
                {/* Set title as h1 */}
                <p className="text-white text-lg mb-2">
                  {formData.description}
                </p>{" "}
                {/* Set description as paragraph */}
              </section>

              {/* Image Section */}
              {formData.imageUrl && formData.imageUrl.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center gap-4">
                    {formData.imageUrl.map((url, index) => (
                      <div key={index} className="relative">
                        <Image
                          width={500}
                          height={300}
                          alt={`Image ${index + 1}`}
                          src={url}
                          className="rounded-md border-4 border-white"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Video Section */}
              {formData.embedUrl && (
                <section className="space-y-4">
                  <div className="flex items-center">
                    <iframe
                      width="560"
                      height="315"
                      src={formData.embedUrl}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-md"
                    ></iframe>
                  </div>
                </section>
              )}
            </div>
          </>
        ) : (
          <div className="bg-gray-800 p-4 rounded space-y-4 mt-4">
            Not yet Submitted...
          </div>
        )}
      </div>
    </div>
  );
};

export default Week;
