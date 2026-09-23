import React, { useEffect, useState } from 'react'
import styles from './Faqs.module.css';
import { Lang } from '../../lang.jsx';
import { toast } from 'react-toastify';

export default function Faqs() {

  const [activeIndex, setActiveIndex] = useState(null);
  const [faqs, setIsFaqs] = useState([]);
  const selectedLanguage = localStorage.getItem("lang") || 'en';
  const langValue = Lang[selectedLanguage];
  // Function to toggle the accordion
  const toggleFAQ = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Close the currently open accordion
    } else {
      setActiveIndex(index); // Open the clicked accordion
    }
  };
  //////////////////////START GET FAQS////////////////////////////////
  const getFaqs = async () => {

    try {
      const response = await fetch(`https://shplayer.onrender.com/faq/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {

        setIsFaqs(data.allFaq)
        // console.log(data.footerContent.content);

      } else {
        switch (response.status) {
          case 500:
            console.log(data.message);
            break;
          default:
            toast('An error occurred. Please try again.');
        }
      }

    } catch (err) {
      console.error("Error Saving Content:", err);
    } finally {
    }
  };
  useEffect(() => {
    getFaqs()
  }, [])
  ////////////////////////END GET FAQS//////////////////////////////// 

  return (




    <>

      <section className="bg-black py-16 px-4" id='faqs'>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl text-white text-center mb-8">{langValue['faqsTitle']}</h1>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="">
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full text-left p-4 rounded-lg flex justify-between items-center transition-colors ${activeIndex === index ? 'bg-gray-800 border border-primary' : 'bg-gray-900 border border-transparent'}`}
                >
                  <span className="text-white font-medium">{faq?.question}</span>
                  <span className="text-gray-300">
                    {activeIndex === index ? '-' : '+'}
                  </span>
                </button>

                <div className={`${activeIndex === index ? 'max-h-[800px] opacity-100 py-4' : 'max-h-0 opacity-0'} overflow-hidden transition-all duration-500`}>
                  <div className="p-4 bg-gray-800 rounded-lg text-gray-200">
                    {faq?.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>






  )
}
