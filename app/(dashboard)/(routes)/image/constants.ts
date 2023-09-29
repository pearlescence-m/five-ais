import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Image Prompt is required."
  }),
  resolution: z.string().min(1),
});

export const resolutionOptions = [
  {
    value: "256x256",
    label: "256x256",
  },
  {
    value: "512x512",
    label: "512x512",
  },
  {
    value: "1024x1024",
    label: "1024x1024",
  },
];