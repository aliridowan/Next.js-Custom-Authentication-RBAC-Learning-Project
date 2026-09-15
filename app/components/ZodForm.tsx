'use client'
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(3, 'Name shold be at least 3 characters long').max(20, 'Name should be less than 20 characters long'),

  age: z.coerce.number().min(18, 'Age should be at least 18').max(99, 'Age should be less than 99'),

  company: z.string().min(3, 'Company name should be at least 3 characters long').max(20, 'Company name should be less than 20 characters long'),
  password: z.string().min(6, 'Password should be at least 6 characters long').max(20, 'Password should be less than 20 characters long'),
  conform: z.string().min(6, 'Confirm password should be at least 6 characters long').max(20, 'Confirm password should be less than 20 characters long'),
}).refine((data) => data.password === data.conform, {
  error: "Passwords don't match",
  path: ["confirm"], // path of error
});


// type Inputs = {
//   name: string
//   company: string
//   age: string
//   phone: string
//   email: string
//   dropdown: string
// }

type FormData = z.infer<typeof formSchema>

export default function ZodForm() {

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => console.log(data)

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Full Name: </label>
          <input id="name" {...register('name')} />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="age">Age: </label>
          <input id="age" {...register('age')} />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input id="password" type="password" {...register('password')} />
        </div>
        <div>
          <label htmlFor="conform">Password: </label>
          <input id="conform" type="password" {...register('conform')} />
        </div>

        <div>
          <label htmlFor="company">Company name: </label>
          <input id="company" {...register('company')} />
        </div>
        <Select>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <button type="submit"> Submit Form</button>
      </form>
    </>

  )
}
