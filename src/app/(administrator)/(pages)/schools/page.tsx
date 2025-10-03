'use client'

import { AppHeader } from '@/components/AppHeader'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SelectFilter from '@/components/SelectFilter'
import { Ellipsis, Plus, Search } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from '@/components/ui/card'
import { schools } from '@/data'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { Pagination } from "@/components/Pagination";



export default function page() {
  const [page, setPage] = useState(1);
  const totalPages = 10;

  return (
    <>
      <AppHeader title='All Schools' />
       <div className='flex p-5 gap-5'>
          <SelectFilter key={"state"} label='Select State' values={["All", "Uttar Pradesh", "Bihar", "Delhi", "Mumbai"]} />
          <SelectFilter key={"city"} label='Select City' values={["All", "Varanasi", "Noida", "Kashi", "Banaras"]} />
          <div key={"search"} className="flex w-full  items-center gap-2">
            <Input type="text" placeholder="Search schools hear.." />
            <Button type="submit" variant="outline">
              <Search />
            </Button>
          </div>
          <Button type="submit" variant="outline" className='bg-green-500 hover:bg-green-600'>
              <Plus />
              Register School
          </Button>
       </div>
       <Card className='p-2 m-2 mx-5'>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            { schools.map((school)=>{
                return (
                  <TableRow key={school.registerId}>
                    <TableCell><Checkbox className='cursor-pointer' /></TableCell>
                    <TableCell><Link href={"#"} className='text-sky-800 font-medium'>{school.name}</Link></TableCell>
                    <TableCell>{school.email}</TableCell>
                    <TableCell>{school.phone}</TableCell>
                    <TableCell>{school.city}</TableCell>
                    <TableCell>{school.state}</TableCell>
                    <TableCell className="float-right pr-5"><Ellipsis className='cursor-pointer hover:bg-gray-300 rounded-xl' /></TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
       </Card>
       <div className='pb-5'>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
       </div>
    </>
  )
}

