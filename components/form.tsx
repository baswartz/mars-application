'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Controller } from 'react-hook-form'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import dayjs from 'dayjs';

import dynamic from 'next/dynamic';
import { z } from 'zod'
import { FormDataSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'

type Inputs = z.infer<typeof FormDataSchema>

const steps = [
  {
    id: 'Stage 1',
    name: 'Personal Information',
    fields: ['fullName', 'dob', 'nationality', 'email', 'phone']
  },
  {
    id: 'Stage 2',
    name: 'Travel Preferences',
    fields: ['departure', 'return', 'accommodation', 'requests']
  },
  {
    id: 'Stage 3',
    name: 'Health and Safety',
    fields: ['declaration', 'emergencyContact', 'medicalConditions']
  }
]

const Starfield = dynamic(
    () => import('@/components/Starfield'),
    { ssr: false }
  );

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [submitted, setSubmitted] = useState(false);
  const delta = currentStep - previousStep

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    control,
    formState: { errors, isValid }
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    mode: 'onChange',
    defaultValues: {
        // ...other defaults...
        dateRange: {
          from: dayjs().format('YYYY-MM-DD'),
          to: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        },
      },
    reValidateMode: 'onChange',
    shouldUnregister: false
  })

  const processForm: SubmitHandler<Inputs> = async data => {
    try {
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
  
      if (!response.ok) {
        throw new Error('Failed to submit form')
      }
  
      const result = await response.json()
      console.log(result.message)
      reset()
      setSubmitted(true)
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Something went wrong. Please try again.')
    }
  }
  

  type FieldName = keyof Inputs

  const next = async () => {
    const fields = steps[currentStep].fields
    const output = await trigger(fields as FieldName[], { shouldFocus: true })

    if (!output) return

    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step + 1)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step - 1)
    }
  }

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="fixed inset-0 -z-10 bg-black">
            <Starfield />
        </div>

        <section className='absolute inset-0 text-white flex flex-col justify-between p-8 md:p-24'>
        {submitted ? (
            <div className="flex flex-col items-center justify-center h-full w-full">
            <h2 className="text-2xl font-bold text-sky-700 mb-4">
                Thank you for completing the form!
            </h2>
            </div>
        ) : (
            <>
                {/* Progress Steps */}
                <nav aria-label="Progress" className="mb-8">
                    <ol role="list" className="flex items-center">
                        {steps.map((step, index) => {
                        const isComplete = currentStep > index;
                        const isCurrent = currentStep === index;
                        return (
                            <li key={step.name} className="relative flex-1 flex items-center">
                            <div
                                className={`
                                flex items-center w-full px-4 py-2 border
                                ${isCurrent
                                    ? 'border-blue-500 bg-blue-900/20'
                                    : isComplete
                                    ? 'border-green-500 bg-green-900/10'
                                    : 'border-gray-700 bg-black'}
                                rounded-lg transition-colors
                                `}
                            >
                                {/* Number or Checkmark and Stage */}
                                <div className="flex items-center mr-4">
                                <div
                                    className={`
                                    flex items-center justify-center w-8 h-8 rounded-full text-base font-bold
                                    ${isCurrent
                                        ? 'bg-blue-500 text-white'
                                        : isComplete
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-800 text-blue-300 border border-blue-900'}
                                    `}
                                >
                                    {isComplete ? (
                                    // Checkmark for completed steps
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    ) : (
                                    index + 1
                                    )}
                                </div>
                                <span className={`ml-2 text-xs font-semibold tracking-wide uppercase ${isCurrent ? 'text-blue-400' : isComplete ? 'text-green-400' : 'text-gray-400'}`}>
                                    {step.id}
                                </span>
                                </div>
                                {/* Step Name */}
                                <span className={`text-sm font-medium ${isCurrent ? 'text-white' : isComplete ? 'text-green-200' : 'text-gray-300'}`}>
                                {step.name}
                                </span>
                            </div>
                            {/* Connector */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-0.5 bg-gray-700 mx-2" aria-hidden="true" />
                            )}
                            </li>
                        );
                        })}
                    </ol>
                </nav>



                {/* Form */}
                <form ref={formRef} className='mt-8 py-8' onSubmit={handleSubmit(processForm)}>
                    {/* Stage 1: Personal Information */}
                    {currentStep === 0 && (
                    <motion.div
                        initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <h2 className='text-base font-semibold leading-7 text-white-900'>
                        Personal Information
                        </h2>
                        <p className='mt-1 text-sm leading-6 text-white-600'>
                        Provide your personal details.
                        </p>
                        <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                        {/* Full Name */}
                        <div className='sm:col-span-3'>
                            <label htmlFor='fullName' className='block text-sm font-medium leading-6 text-white-900'>
                            Full Name
                            </label>
                            <div className='mt-2'>
                            <input
                                type='text'
                                id='fullName'
                                {...register('fullName')}
                                autoComplete='name'
                                className='block w-full rounded-md border border-white-500 py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                            />
                            {errors.fullName?.message && (
                                <p className='mt-2 text-sm text-red-400'>{errors.fullName.message}</p>
                            )}
                            </div>
                        </div>
                        {/* Date of Birth */}
                        <div className='sm:col-span-3'>
                            <label htmlFor='dob' className='block text-sm font-medium leading-6 text-white-900'>
                                Date of Birth
                            </label>
                            <div className='mt-2'>
                                <Controller
                                name="dob"
                                control={control}
                                render={({ field }) => (
                                    <input
                                    type="date"
                                    id="dob"
                                    className="block w-full rounded-md border border-white-500 py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    value={field.value ? field.value.toISOString().substring(0, 10) : ''}
                                    onChange={e => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                                    />
                                )}
                                />
                                {errors.dob?.message && (
                                <p className='mt-2 text-sm text-red-400'>{errors.dob.message as string}</p>
                                )}
                            </div>
                        </div>
                        {/* Nationality */}
                        <div className='sm:col-span-3'>
                            <label htmlFor='nationality' className='block text-sm font-medium leading-6 text-white-900'>
                            Nationality
                            </label>
                            <div className='mt-2'>
                            <input
                                type='text'
                                id='nationality'
                                {...register('nationality')}
                                autoComplete='country'
                                className='block w-full rounded-md border border-white-500 py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                            />
                            {errors.nationality?.message && (
                                <p className='mt-2 text-sm text-red-400'>{errors.nationality.message}</p>
                            )}
                            </div>
                        </div>
                        {/* Email */}
                        <div className='sm:col-span-3'>
                            <label htmlFor='email' className='block text-sm font-medium leading-6 text-white-900'>
                            Email Address
                            </label>
                            <div className='mt-2'>
                            <input
                                type='email'
                                id='email'
                                {...register('email')}
                                autoComplete='email'
                                className='block w-full rounded-md border border-white-500 p py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                            />
                            {errors.email?.message && (
                                <p className='mt-2 text-sm text-red-400'>{errors.email.message}</p>
                            )}
                            </div>
                        </div>
                        {/* Phone */}
                        <div className='sm:col-span-3'>
                            <label htmlFor='phone' className='block text-sm font-medium leading-6 text-white-900'>
                            Phone Number
                            </label>
                            <div className='mt-2'>
                            <input
                                type='tel'
                                id='phone'
                                inputMode='tel'
                                pattern='[0-9\-+\s]+'
                                {...register('phone')}
                                autoComplete='tel'
                                className='block w-full rounded-md border border-white-500 p py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                            />
                            {errors.phone?.message && (
                                <p className='mt-2 text-sm text-red-400'>{errors.phone.message}</p>
                            )}
                            </div>
                        </div>
                        </div>
                    </motion.div>
                    )}

                    {/* Stage 2: Travel Preferences */}
                    {currentStep === 1 && (
                    <motion.div
                        initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <h2 className='text-base font-semibold leading-7 text-white-900'>
                        Travel Preferences
                        </h2>
                        <p className='mt-1 text-sm leading-6 text-white-600'>
                        Tell us about your travel plans.
                        </p>
                        <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                        {/* Departure-Return Date Range */}
                        <Controller
                            name="dateRange"
                            control={control}
                            render={({ field }) => (
                                <DateRangePicker
                                value={[
                                    field.value?.from ? dayjs(field.value.from) : null,
                                    field.value?.to ? dayjs(field.value.to) : null
                                ]}
                                onChange={([from, to]) => {
                                    field.onChange({
                                    from: from ? from.format('YYYY-MM-DD') : '',
                                    to: to ? to.format('YYYY-MM-DD') : ''
                                    })
                                }}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        placeholder: "MM/DD/YYYY - MM/DD/YYYY",
                                        sx: {
                                          // Label color
                                          "& .MuiInputLabel-root": { color: "white" },
                                          "& .MuiInputLabel-root.Mui-focused": { color: "white" },
                              
                                          // Input text color
                                          "& .MuiInputBase-input": { color: "white" },
                              
                                          // Outlined border color
                                          "& .MuiOutlinedInput-root": {
                                            "& fieldset": { borderColor: "white" },
                                            "&:hover fieldset": { borderColor: "#0ea5e9" }, // Optional: hover color
                                            "&.Mui-focused fieldset": { borderColor: "#0ea5e9" }, // Optional: focus color
                                          },
                              
                                          // Icon color
                                          "& .MuiSvgIcon-root": { color: "white" },
                                        }
                                      }
                                }}
                                />
                            )}
                            />
                            {errors.dateRange && (
                            <p className="mt-2 text-sm text-red-400">{errors.dateRange.message}</p>
                        )}
                        {errors.dateRange?.to && (
                        <p className="mt-2 text-sm text-red-400">{errors.dateRange.to.message}</p>
                        )}

                        {/* Accommodation Preference */}
                        <div className='sm:col-span-3'>
                            <label htmlFor='accommodation' className='block text-sm font-medium leading-6 text-white-900'>
                            Accommodation Preference
                            </label>
                            <div className='mt-2'>
                            <select
                                id='accommodation'
                                {...register('accommodation')}
                                className='block w-full rounded-md border border-white-500 p py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                            >
                                <option value=''>Select an option</option>
                                <option value='space-hotel'>Space Hotel</option>
                                <option value='martian-base'>Martian Base</option>
                            </select>
                            {errors.accommodation?.message && (
                                <p className='mt-2 text-sm text-red-400'>{errors.accommodation.message}</p>
                            )}
                            </div>
                        </div>
                        {/* Special Requests */}
                        <div className='sm:col-span-6'>
                            <label htmlFor='requests' className='block text-sm font-medium leading-6 text-white-900'>
                            Special Requests or Preferences
                            </label>
                            <div className='mt-2'>
                            <textarea
                                id='requests'
                                {...register('requests')}
                                rows={3}
                                className='block w-full rounded-md border border-white-500 p py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                            />
                            {errors.requests?.message && (
                                <p className='mt-2 text-sm text-red-400'>{errors.requests.message as string}</p>
                            )}
                            </div>
                        </div>
                        </div>
                    </motion.div>
                    )}

                    {/* Stage 3: Health and Safety */}
                    {currentStep === 2 && (
                    <motion.div
                        initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <h2 className='text-base font-semibold leading-7 text-white-900'>
                        Health and Safety
                        </h2>
                        <p className='mt-1 text-sm leading-6 text-white-600'>
                        For your safety, please provide the following information.
                        </p>
                        <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                        {/* Health Declaration */}
                        <div className='sm:col-span-6'>
                            <div className='flex items-center'>
                            <input
                                type='checkbox'
                                id='declaration'
                                {...register('declaration')}
                                className='h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600'
                            />
                            <label htmlFor='declaration' className='ml-2 block text-sm font-medium leading-6 text-white-900'>
                                I declare that I am in good health for space travel.
                            </label>
                            </div>
                            {errors.declaration?.message && (
                            <p className='mt-2 text-sm text-red-400'>{errors.declaration.message as string}</p>
                            )}
                        </div>
                        {/* Emergency Contact */}
                        <div className='sm:col-span-3'>
                            <label htmlFor='emergencyContact' className='block text-sm font-medium leading-6 text-white-900'>
                            Emergency Contact Number
                            </label>
                            <div className='mt-2'>
                            <input
                                type='tel'
                                id='emergencyContact'
                                inputMode='tel'
                                pattern='[0-9\-+\s]+'
                                {...register('emergencyContact')}
                                autoComplete='tel'
                                className='block w-full rounded-md border border-white-500 p py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                            />
                            {errors.emergencyContact?.message && (
                                <p className='mt-2 text-sm text-red-400'>{errors.emergencyContact.message}</p>
                            )}
                            </div>
                        </div>
                        {/* Medical Conditions */}
                        <div className='sm:col-span-6'>
                            <label htmlFor='medicalConditions' className='block text-sm font-medium leading-6 text-white-900'>
                            Any Medical Conditions? (if applicable)
                            </label>
                            <div className='mt-2'>
                            <textarea
                                id='medicalConditions'
                                {...register('medicalConditions')}
                                rows={2}
                                className='block w-full rounded-md border border-white-500 p py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                            />
                            {errors.medicalConditions?.message && (
                                <p className='mt-2 text-sm text-red-400'>{errors.medicalConditions.message as string}</p>
                            )}
                            </div>
                        </div>
                        </div>
                    </motion.div>
                    )}

                    {/* Confirmation Page */}
                    {currentStep === 3 && (
                    <motion.div
                        initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <h2 className='text-base font-semibold leading-7 text-white-900'>
                        Complete
                        </h2>
                        <p className='mt-1 text-sm leading-6 text-white-600'>
                        Thank you for your submission.
                        </p>
                    </motion.div>
                    )}
                </form>

                {/* Fixed Navigation */}
                <div className="fixed bottom-0 left-0 w-full bg-black/70 z-50 py-4">
                    <div className="flex justify-between items-center max-w-2xl mx-auto px-4 gap-4">
                        {/* Previous Button */}
                        <button
                        type="button"
                        onClick={prev}
                        disabled={currentStep === 0}
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        </button>

                        {/* Submit Button - Center */}
                        <button
                        type="button"
                        disabled={!isValid}
                        onClick={() => formRef.current?.requestSubmit()}
                        className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50 flex-grow max-w-[200px]"
                        >
                        Submit
                        </button>

                        {/* Next Button */}
                        <button
                        type="button"
                        onClick={next}
                        disabled={currentStep === steps.length - 1}
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        </button>
                    </div>
                </div>
            </>
        )}
        </section>
    </LocalizationProvider>
  )
}
