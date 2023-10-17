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
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ImagePage = () => {
  const router = useRouter()
  const [image, setImage] = useState<string>('')

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
      setImage('')
      const imgRes = Number(values.resolution.split('x')[0])

      const response = await axios.post('/api/image', {
        prompt: values.prompt,
        resolution: imgRes,
      })

      setImage(response.data)
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
                          <SelectItem key={option.value} value={option.value}>
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
            <div className="grid grid-cols-2 grid-rows-1 w-auto h-auto gap-4 m-8">
              <Card className="rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                  <Image fill alt="Generated" src={image} />
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImagePage
