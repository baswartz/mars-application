'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

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

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [submitted, setSubmitted] = useState(false);
  const delta = currentStep - previousStep

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors, isValid }
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    mode: 'onChange', // Validate on change for real-time feedback
    reValidateMode: 'onChange'
  })

  const processForm: SubmitHandler<Inputs> = data => {
    console.log(data)
    reset()
    setSubmitted(true)
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

  return (
    <section className='absolute inset-0 flex flex-col justify-between p-8 md:p-24'>
      {submitted ? (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <h2 className="text-2xl font-bold text-sky-700 mb-4">
            Thank you for completing the form!
          </h2>
        </div>
      ) : (
        <>
            {/* Progress Steps */}
            <nav aria-label='Progress'>
                <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
                {steps.map((step, index) => (
                    <li key={step.name} className='md:flex-1'>
                    {currentStep > index ? (
                        <div className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                        <span className='text-sm font-medium text-sky-600 transition-colors '>
                            {step.id}
                        </span>
                        <span className='text-sm font-medium'>{step.name}</span>
                        </div>
                    ) : currentStep === index ? (
                        <div
                        className='flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                        aria-current='step'
                        >
                        <span className='text-sm font-medium text-sky-600'>
                            {step.id}
                        </span>
                        <span className='text-sm font-medium'>{step.name}</span>
                        </div>
                    ) : (
                        <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                        <span className='text-sm font-medium text-gray-500 transition-colors'>
                            {step.id}
                        </span>
                        <span className='text-sm font-medium'>{step.name}</span>
                        </div>
                    )}
                    </li>
                ))}
                </ol>
            </nav>

            {/* Form */}
            <form className='mt-8 py-8' onSubmit={handleSubmit(processForm)}>
                {/* Stage 1: Personal Information */}
                {currentStep === 0 && (
                <motion.div
                    initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <h2 className='text-base font-semibold leading-7 text-gray-900'>
                    Personal Information
                    </h2>
                    <p className='mt-1 text-sm leading-6 text-gray-600'>
                    Provide your personal details.
                    </p>
                    <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                    {/* Full Name */}
                    <div className='sm:col-span-3'>
                        <label htmlFor='fullName' className='block text-sm font-medium leading-6 text-gray-900'>
                        Full Name
                        </label>
                        <div className='mt-2'>
                        <input
                            type='text'
                            id='fullName'
                            {...register('fullName')}
                            autoComplete='name'
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.fullName?.message && (
                            <p className='mt-2 text-sm text-red-400'>{errors.fullName.message}</p>
                        )}
                        </div>
                    </div>
                    {/* Date of Birth */}
                    <div className='sm:col-span-3'>
                        <label htmlFor='dob' className='block text-sm font-medium leading-6 text-gray-900'>
                        Date of Birth
                        </label>
                        <div className='mt-2'>
                        <input
                            type='date'
                            id='dob'
                            {...register('dob', {
                            valueAsDate: true
                            })}
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.dob?.message && (
                            <p className='mt-2 text-sm text-red-400'>{errors.dob.message as string}</p>
                        )}
                        </div>
                    </div>
                    {/* Nationality */}
                    <div className='sm:col-span-3'>
                        <label htmlFor='nationality' className='block text-sm font-medium leading-6 text-gray-900'>
                        Nationality
                        </label>
                        <div className='mt-2'>
                        <input
                            type='text'
                            id='nationality'
                            {...register('nationality')}
                            autoComplete='country'
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.nationality?.message && (
                            <p className='mt-2 text-sm text-red-400'>{errors.nationality.message}</p>
                        )}
                        </div>
                    </div>
                    {/* Email */}
                    <div className='sm:col-span-3'>
                        <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                        Email Address
                        </label>
                        <div className='mt-2'>
                        <input
                            type='email'
                            id='email'
                            {...register('email')}
                            autoComplete='email'
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.email?.message && (
                            <p className='mt-2 text-sm text-red-400'>{errors.email.message}</p>
                        )}
                        </div>
                    </div>
                    {/* Phone */}
                    <div className='sm:col-span-3'>
                        <label htmlFor='phone' className='block text-sm font-medium leading-6 text-gray-900'>
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
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
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
                    <h2 className='text-base font-semibold leading-7 text-gray-900'>
                    Travel Preferences
                    </h2>
                    <p className='mt-1 text-sm leading-6 text-gray-600'>
                    Tell us about your travel plans.
                    </p>
                    <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                    {/* Departure Date */}
                    <div className='sm:col-span-3'>
                        <label htmlFor='departure' className='block text-sm font-medium leading-6 text-gray-900'>
                        Departure Date
                        </label>
                        <div className='mt-2'>
                        <input
                            type='date'
                            id='departure'
                            {...register('departure', {
                            valueAsDate: true
                            })}
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.departure?.message && (
                            <p className='mt-2 text-sm text-red-400'>{errors.departure.message as string}</p>
                        )}
                        </div>
                    </div>
                    {/* Return Date */}
                    <div className='sm:col-span-3'>
                        <label htmlFor='return' className='block text-sm font-medium leading-6 text-gray-900'>
                        Return Date
                        </label>
                        <div className='mt-2'>
                        <input
                            type='date'
                            id='return'
                            {...register('return', {
                            valueAsDate: true
                            })}
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.return?.message && (
                            <p className='mt-2 text-sm text-red-400'>{errors.return.message as string}</p>
                        )}
                        </div>
                    </div>
                    {/* Accommodation Preference */}
                    <div className='sm:col-span-3'>
                        <label htmlFor='accommodation' className='block text-sm font-medium leading-6 text-gray-900'>
                        Accommodation Preference
                        </label>
                        <div className='mt-2'>
                        <select
                            id='accommodation'
                            {...register('accommodation')}
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
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
                        <label htmlFor='requests' className='block text-sm font-medium leading-6 text-gray-900'>
                        Special Requests or Preferences
                        </label>
                        <div className='mt-2'>
                        <textarea
                            id='requests'
                            {...register('requests')}
                            rows={3}
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
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
                    <h2 className='text-base font-semibold leading-7 text-gray-900'>
                    Health and Safety
                    </h2>
                    <p className='mt-1 text-sm leading-6 text-gray-600'>
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
                        <label htmlFor='declaration' className='ml-2 block text-sm font-medium leading-6 text-gray-900'>
                            I declare that I am in good health for space travel.
                        </label>
                        </div>
                        {errors.declaration?.message && (
                        <p className='mt-2 text-sm text-red-400'>{errors.declaration.message as string}</p>
                        )}
                    </div>
                    {/* Emergency Contact */}
                    <div className='sm:col-span-3'>
                        <label htmlFor='emergencyContact' className='block text-sm font-medium leading-6 text-gray-900'>
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
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.emergencyContact?.message && (
                            <p className='mt-2 text-sm text-red-400'>{errors.emergencyContact.message}</p>
                        )}
                        </div>
                    </div>
                    {/* Medical Conditions */}
                    <div className='sm:col-span-6'>
                        <label htmlFor='medicalConditions' className='block text-sm font-medium leading-6 text-gray-900'>
                        Any Medical Conditions? (if applicable)
                        </label>
                        <div className='mt-2'>
                        <textarea
                            id='medicalConditions'
                            {...register('medicalConditions')}
                            rows={2}
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
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
                    <h2 className='text-base font-semibold leading-7 text-gray-900'>
                    Complete
                    </h2>
                    <p className='mt-1 text-sm leading-6 text-gray-600'>
                    Thank you for your submission.
                    </p>
                </motion.div>
                )}

                {/* Submit Button - Always visible, only enabled if form is valid */}
                <div className='mt-8 flex justify-end'>
                <button
                    type='submit'
                    disabled={!isValid}
                    className='rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50'
                >
                    Submit
                </button>
                </div>
            </form>

            {/* Navigation */}
            <div className='mt-8 pt-5'>
                <div className='flex justify-between'>
                <button
                    type='button'
                    onClick={prev}
                    disabled={currentStep === 0}
                    className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
                >
                    <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='h-6 w-6'
                    >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15.75 19.5L8.25 12l7.5-7.5'
                    />
                    </svg>
                </button>
                <button
                    type='button'
                    onClick={next}
                    disabled={currentStep === steps.length - 1}
                    className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
                >
                    <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='h-6 w-6'
                    >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M8.25 4.5l7.5 7.5-7.5 7.5'
                    />
                    </svg>
                </button>
                </div>
            </div>
        </>
      )}
    </section>
  )
}
