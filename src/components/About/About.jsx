import React, { useEffect, useState } from 'react'
import styles from './About.module.css';
import tv from '../../assets/Image/TV.png'
import mobil from '../../assets/Image/mobile movie screen.png'
import appStore from '../../assets/Image/appstore.png'
import { Lang } from '../../lang.jsx';

export default function About() {

  let [count, setCount] = useState(0);
    const selectedLanguage = localStorage.getItem("lang") || 'en';
    const langValue = Lang[selectedLanguage];
  useEffect(() => { }, [])
  return (
    <>

      <section className="px-4 py-8 lg:py-16 z-10 bg-white">
        <div className="container mx-auto">

          {/* First Row */}
          <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-8 my-8">
            <div className="w-full lg:w-3/4">
              <img src={tv} alt="TV media player" className="mx-auto rounded-xl lg:mx-0 w-full max-w-[400px] lg:max-w-none" />
            </div>
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0 text-center lg:text-left px-4">
              <h1 className="font-bold text-2xl lg:text-[2rem] text-[#413F3F] leading-tight">
                {langValue['wishtvAboutone']}
              </h1>
              <p className="text-[#413F3F] text-lg lg:text-[1.5rem] mt-4">
              {langValue['wishtvAboutTwo']}
              </p>
            </div>
          </div>

          {/* Second Row */}
          <div className="flex flex-col-reverse lg:flex-row items-center justify-center lg:space-x-8 my-8 lg:py-10">
            <div className="w-full lg:w-3/4 text-center lg:text-left lg:ml-[6.25rem]">
              <h1 className="font-bold text-2xl lg:text-[2.5rem] text-[#413F3F] leading-tight mb-3">
              {langValue['MobileVersion']}
              </h1>
              <span className={`${styles.wishtv_text} text-3xl lg:text-[3rem] mx-3 font-bold`}>SH Player</span>
              <h1 className="font-bold text-2xl lg:text-[2.5rem] text-[#413F3F] leading-tight">
              {langValue['available']}
              </h1>
              <p className="text-[#413F3F] text-lg lg:text-[1.7rem] mt-4 font-medium">
              {langValue['wishtvAppAboutThree']}
              </p>
              <img src={appStore} className="w-[18rem] lg:w-[30rem] mr-auto  mt-6" alt="App Stores" />
            </div>
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
              <img src={mobil} alt="Mobile Wish TV" className="m-auto w-[15rem] lg:w-[20rem]" />
            </div>
          </div>
        </div>
      </section>


    </>
  )
}
