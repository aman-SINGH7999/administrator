'use client'

import { AppHeader } from '@/components/AppHeader'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label";
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
import { schools, statesWithCities } from '@/data'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { Pagination } from "@/components/Pagination";
import { Modal } from "@/components/Modal";
import axios from "axios";
import { ComboBox } from '@/components/SearchableDropdown';



export default function page() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const [form, setForm] = useState({
    name: "",
    owner: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const totalPages = 10;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);
      setLoading(true);

      try {
        const res = await axios.post("/api/schools", form);

        if (res.data.success) {
          setSuccess("School registered successfully!");
          setForm({
            name: "",
            owner: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
          });
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to register school");
      } finally {
        setLoading(false);
      }
    };



  return (
    <>
      {/* App header */}
      <AppHeader title='All Schools' />

      {/* Filters, Search and other Options */}
      <div className="flex flex-col md:flex-row p-5 gap-3 md:gap-5 justify-center md:items-center">
        <div className='flex flex-col sm:flex-row gap-3 md:items-center'>
          {/* State */}
          <div className="w-full md:w-48">
            <ComboBox
              label=""
              value={state}
              onChange={(val) => setState(val)}
              options={Object.keys(statesWithCities)}
              placeholder="Select State"
            />
          </div>

          {/* City */}
          <div className="w-full md:w-48">
            <ComboBox
              label=""
              value={city}
              onChange={(val) => setCity(val)}
              options={state ? statesWithCities[state] : []}
              placeholder={state ? "Select City" : "Select State first"}
              disabled={!state}
            />
          </div>
          
          {/* Clear / All button + Search */}
          <Button
              type="button"
              variant="outline"
              className="whitespace-nowrap"
              onClick={() => {setCity(""); setState(""); setSearchValue("")}}
          >
              Clear Filters
          </Button>
        </div>
      

        
        <div className="flex w-full items-center gap-2">
          <Input
            type="text"
            value={searchValue}
            onChange={(e)=> setSearchValue(e.target.value)}
            placeholder="Search schools here..."
            className="flex-1 min-w-[100px]"
          />

          <Button type="submit" variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Register School */}
        <div className="w-full md:w-auto">
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Register School
          </Button>
        </div>
      </div>


       {/* Table data */}
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

       {/* Pagination */}
       <div className='pb-5'>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
       </div>
        
        {/* Modal form */}
       <Modal isOpen={open} onClose={() => setOpen(false)} title="Register School" className='w-[700px] m-1 md:m-0'>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[90vh] overflow-y-scroll">
            {/* School Name */}
            <div className="md:col-span-2">
              <Label htmlFor="name" className='mb-1'>School Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>

            {/* Owner Name */}
            <div className="md:col-span-2">
              <Label className='mb-1' htmlFor="owner">Owner Name</Label>
              <Input id="owner" name="owner" value={form.owner} onChange={handleChange} required />
            </div>

            {/* Email */}
            <div >
              <Label className='mb-1' htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
            </div>

            {/* Phone */}
            <div >
              <Label className='mb-1' htmlFor="phone">Phone</Label>
              <Input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} required />
            </div>

            {/* State */}
            <div>
              <ComboBox
                label="State"
                value={form.state}
                onChange={(val) => setForm({ ...form, state: val, city: "" })}
                options={Object.keys(statesWithCities)}
                placeholder="Select State"
              />
            </div>

            {/* City */}
            <div>
              <ComboBox
                label="City"
                value={form.city}
                onChange={(val) => setForm({ ...form, city: val })}
                options={form.state ? statesWithCities[form.state] : []}
                placeholder={form.state ? "Select City" : "Select State first"}
                disabled= {!form.state}
              />
            </div>

            {/* Address */} 
            <div className="md:col-span-2">
              <Label className='mb-1' htmlFor="address">Address</Label> 
              <Input id="address" name="address" value={form.address} onChange={handleChange} /> 
            </div>

            {/* Error / Success */}
            <div className="md:col-span-2">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
                {loading ? "Registering..." : "Register School"}
              </Button>
            </div>
          </form>
      </Modal>
    </>
  )
}

