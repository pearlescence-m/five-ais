'use client'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Download, ImageIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { Heading } from '@/components/heading'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/empty'
import { Loader } from '@/components/loader'

import { resolutionOptions, formSchema } from './constants'
import { Card, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const ImagePage = () => {
  const router = useRouter()
  const [image, setImage] = useState<string>("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      resolution: '512x512',
    },
  })
  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImage("");
      const response = await axios.post('/api/image',  {
        prompt: values.prompt,
        resolution: values.resolution
      }
      );
      // const img = URL.createObjectURL(new Blob([response.data]))
      // console.log(img)
      // Check if the response is a valid blob.

      // console.log(response.data.blob())



      const imgURL = URL.createObjectURL(response.data);
      console.log(imgURL)
        // Set the URL as the new image source.
      // setImage(imgURL);

      // const buffer = Buffer.from(response.data);
      // console.log(buffer)
      // const attach = new AttachmentBuilder(buffer, { name: 'result.jpeg' });
      // // const image = cv.imdecode(buffer);
      // setImage(img);
      form.reset();
    } catch (error: any) {
      console.log(error)
    } finally {
      router.refresh()
    }
  }

  return (
    <div>
      <Heading
        title="Image Generation"
        description="Turn your prompt into an image."
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="A picture of horse in Swiss Alps"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="resolution"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-2">
                  <Select 
                    disabled={isLoading} 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resolutionOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                type="submit"
                disabled={isLoading}
                size="icon"
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {image.length === 0 && !isLoading && (
            <Empty label="No image generated." />
          )}
          {image.length != 0 && (
          <div className="w-auto h-auto">
              <Card className="rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                  <img alt="Generated" src={image} />
                </div>
                {/* <CardFooter className="p-2">
                  <Button
                    onClick={() => window.open(image)}
                    variant="secondary"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardFooter> */}
              </Card>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImagePage
