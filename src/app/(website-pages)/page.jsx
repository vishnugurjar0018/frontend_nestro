import CategorySection from '@/componends/website/home/CategorySection'
import HomePageHeroSection from '@/componends/website/home/HomeHero'
import React from 'react'

export default function page() {
  return (
    <div className='bg-[#fff]'>
      <HomePageHeroSection/>
      <CategorySection/>
    </div>
  )
}
