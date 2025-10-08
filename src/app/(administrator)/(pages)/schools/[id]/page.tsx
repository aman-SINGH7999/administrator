import { AppHeader } from '@/components/AppHeader'
import RadialChart from '@/components/RadialChart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Pencil, BookUser, Package2, LucideIcon, Diamond, Boxes, SquareActivity, CornerDownRight, PersonStanding, PackageOpen, CreditCard, Megaphone  } from 'lucide-react'
import Image from 'next/image'
import React from 'react'


export default function Page() {
  return (
    <>
    {/* App header */}
    <AppHeader title='School > Adarsh Inter College' />
      <div className='grid grid-cols-1 gap-5 px-5 pt-10'>
        <Card className='rounded-none'>
            <CardContent className='grid grid-cols-1 lg:grid-cols-4 gap-6 w-full'>
                {/* School Info */}
                <div className="relative lg:col-span-2 flex items-center gap-5">
                    <Image
                    src="/school.png"
                    alt="School"
                    height={120}
                    width={120}
                    className="object-cover hidden xl:block"
                    />
                    <div className="flex flex-col justify-center w-full items-center lg:items-start">
                        <div className=''>
                            <h2 className="font-semibold text-xl text-gray-800 font-mono">Ram Prashad School</h2>
                            <Button variant="ghost" className='cursor-pointer absolute -top-2 -right-2'><Pencil /></Button>
                        </div>
                        <p className="text-gray-700 text-sm">
                            Sector 15, Mahuariya, Sonbhadra, Uttar Pradesh
                        </p>
                        <div className="mt-1 text-sm space-y-0.5 flex flex-col justify-center w-full items-center lg:items-start">
                            <div>
                            <span className="font-semibold text-gray-600">Admin: </span> Ram ji
                            </div>
                            <div>
                            <span className="font-semibold text-gray-600">Contact: </span> 9876543210
                            </div>
                            <div>
                            <span className="font-semibold text-gray-600">Email: </span> ramji@gmail.com
                            </div>
                            <div className="text-gray-500 text-xs pt-1">
                            Registered At: 30 Feb, 2025
                            </div>
                        </div>
                    </div>
                </div>

                {/* Members Info */}
                <div className="flex flex-col justify-center items-center lg:items-start space-y-1 border-l pl-6">
                    <div className="font-semibold text-lg text-gray-800 font-mono"> Members </div>
                    <div><span className="font-semibold text-gray-600">Total Staff:</span> 2</div>
                    <div><span className="font-semibold text-gray-600">Total Teacher:</span> 8</div>
                    <div><span className="font-semibold text-gray-600">Total Students:</span> 320</div>
                    <div><span className="font-semibold text-gray-600">Total Packages:</span> 6</div>
                </div>

                {/* Radial Chart */}
                <div className="flex items-center justify-center h-[200px] lg:h-auto">
                    <RadialChart />
                </div>
            </CardContent>
        </Card>
    </div>
    <div className='grid grid-cols-3 gap-5 p-5'>
        <SchoolInfoCard title="Teachers/Staff" mainIcon={BookUser} subIcon={Diamond} />
        <SchoolInfoCard title="Packages" mainIcon={Package2} subIcon={Boxes} />
        <SchoolInfoCard title="Recent Activity" mainIcon={SquareActivity} subIcon={CornerDownRight} />
    </div>
    <div className='grid grid-cols-4 gap-5 p-5'>
        <Card className='h-28 rounded-none flex flex-row gap-1 p-0 justify-center items-center cursor-pointer hover:bg-gray-100'>
            <PersonStanding />Students</Card>
        <Card className='h-28 rounded-none flex flex-row gap-1 p-0 justify-center items-center cursor-pointer hover:bg-gray-100'>
            <PackageOpen />Packages</Card>
        <Card className='h-28 rounded-none flex flex-row gap-1 p-0 justify-center items-center cursor-pointer hover:bg-gray-100'>
            <CreditCard />Payments</Card>
        <Card className='h-28 rounded-none flex flex-row gap-1 p-0 justify-center items-center cursor-pointer hover:bg-gray-100'>
            <Megaphone />Announcement</Card>
    </div>
    </>
  )
}


interface ISchoolInfoCard {
  title?: string
  mainIcon?: LucideIcon
  subIcon?: LucideIcon
}

const listItems = [
    "Lorem ipsum dolor sit amet.",
    "Consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt.",
    "Ut labore et dolore magna aliqua.",
    "Duis aute irure dolor in reprehenderit.",
  ]

const SchoolInfoCard = ({
  title = "Card Title",
  mainIcon: MainIcon,
  subIcon: SubIcon,
}: ISchoolInfoCard) => {
  return (
    <Card className="h-56 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 relative gap-0">
      <CardHeader className="py-0">
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <div className="flex items-center gap-2 text-gray-800">
            {MainIcon && <MainIcon className="h-5 w-5 text-primary" />}
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-primary"
          >
            View All
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-5 overflow-hidden">
        <ul className="space-y-1 text-sm text-gray-700">
          {listItems.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 hover:text-primary transition-all duration-150"
            >
              {SubIcon && (
                <SubIcon className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
              )}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
