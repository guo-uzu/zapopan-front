import { SignUp } from '@clerk/nextjs'
import React from 'react'
import Layout from '@/app/layout'

export default function Register() {
  return (
    <Layout>
    <main>
          <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <SignUp />
          </div>
        </div>
        </main>
    </Layout>
  )
}
