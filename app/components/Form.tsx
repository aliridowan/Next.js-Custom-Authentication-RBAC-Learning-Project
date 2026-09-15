'use client'
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
  name: string
  company: string
  age: string
  phone: string
  email: string
  dropdown: string
}

export default function Form() {

  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()


  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Full Name</label>
          <input id="name" {...register('name', { required: "Name can't  be Empty" })} />
          {errors.name && <span>{errors.name.message}</span>}
        </div>

        <div>
          <label htmlFor="age">AGe:</label>
          <input id="age" {...register('age', {
            min: {
              value: 10,
              message: "You have to avobe 10 "
            },
            max: {
              value: 80,
              message: "You shold be less then 80"

            }

          })} />
          {errors.age && <span>{errors.age.message}</span>}

        </div>

        <div>
          <label htmlFor="company">Company name</label>
          <input id="company" {...register('company')} />
        </div>

        <button type="submit"> Submit Form</button>
      </form>
    </>

  )
}
