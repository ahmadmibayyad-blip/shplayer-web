import React, { useEffect, useState } from 'react'
import styles from './ActivateDevices.module.css';
import stripe from '../../assets/Image/Stripe-Logo1.png'
import visa from '../../assets/Image/visa.webp';
import { Lang } from '../../lang.jsx';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
export default function ActivateDevices() {
  const stripe = useStripe();
  const elements = useElements();
  const [payPopUp, setPayPopUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMacAddress, setIsMacAddress] = useState('');
  const [price, setPrice] = useState(0);

  function openPopup() {
    if (price != 0) {
      setPayPopUp(true)
    } else {
      toast.error("Price Subscription not available now, connect with the customer service")
    }

  }

  const handlePayment = async (e) => {
    e.preventDefault();
    if (isMacAddress == '') {
      toast.error("Mac address is Required")
      return;
    }
    setIsLoading(true);

    // Payment Intent
    const response = await fetch('https://shplayer.onrender.com/subscription/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `shM0${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ amount: price * 100, macAddress: isMacAddress }), // Amount in cents
    });

    const data = await response.json();

    const clientSecret = data.clientSecret

    // Make a payment with stripe
    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: isMacAddress,
        }
      }
    });

    if (error) {
      toast.error(error.message, {
        theme: "dark"
      });
      setIsLoading(false)
    } else {
      if (paymentIntent.status === 'succeeded') {
        subscription();
      }
    }
  };


  const subscription = async () => {
    try {
      const response = await fetch(`https://shplayer.onrender.com/subscription/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `shM0${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ subscriptionType: "yearly", cost: 10 })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message, {
          theme: 'dark'
        })
        setPayPopUp(false)
        setIsMacAddress('')
      } else {
        switch (response.status) {
          case 500:
            toast.error(data.message, {
              theme: "dark"
            });
          case 400:
            toast.error(data.message, {
              theme: "dark"
            });
          case 404:
            toast.error(data.message, {
              theme: "dark"
            });
            break;
          default:
            toast('An error occurred. Please try again.', {
              theme: "dark"
            });
        }
      }

    } catch (err) {
      console.error("Error Saving Faqs:", err);
    } finally {
      setIsLoading(false)
    }
  };

  /////////////////////// START GET PRICE////////////////////
  const getPrice = async () => {

    try {
      const response = await fetch(`https://shplayer.onrender.com/price/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();


      if (response.ok) {
        setPrice(data.subscriptionPrice.price);

      } else {
        switch (response.status) {
          case 500:
            console.log(data.message);

          case 404:
            console.log(data.message);

            break;
          default:
            console.log('An error occurred. Please try again.');
        }
      }

    } catch (err) {
      console.error("Error Saving Content:", err);
    } finally {
      setIsLoading(false)
    }
  };



  useEffect(() => {
    getPrice()
  }, [])


  /////////////////////////END GET PRICE///////////////////////////

  const selectedLanguage = localStorage.getItem("lang") || 'en';
  const langValue = Lang[selectedLanguage];


  useEffect(() => { }, [])
  return (
    <>
      <div className="max-w-lg w-full">
        <h1 className="text-[#3C3C3C] text-3xl font-bold mb-5">{langValue['ActivateDevice']}</h1>
        <div className="mb-5">
          <h1 className="text-[#4548AC] text-2xl font-medium mb-5">{langValue['Price']} : {price}$</h1>
        </div>
        <div className="flex flex-col items-start mb-5">
          <h1 className="text-[#3C3C3C] text-2xl font-medium mb-5">{langValue['PaymentMethod']}</h1>
          <div className='flex items-center gap-7'>
            <a className='cursor-pointer'>
              <img className='border py-2 px-3 rounded-2xl w-60' src={visa} alt="" srcset="" onClick={openPopup} />
            </a>

          </div>
        </div>

        <b className="text-[13px] block text-[#7D7E81]">
          <span className="text-red-600">{langValue['noteOne']}: </span>
          {langValue['noteDesc']}
        </b>
      </div>
      {payPopUp ?
        <div id="popup-modal" tabindex="-1" className="fixed backdrop-blur-sm z-[9999] top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 ">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Checkout for susbscription
                </h3>
                <button type="button" onClick={() => setPayPopUp(false)} class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5">
                <form onSubmit={handlePayment}>
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label htmlFor="macAddress" className="flex mb-2  font-medium text-gray-900 dark:text-white">Mac Address</label>
                      <input type="text"
                        onChange={(e) => {
                          let input = e.target.value;
                          input = input.replace(/[^a-zA-Z0-9]/g, '');
                          const formatted = input.match(/.{1,2}/g)?.join(':') || '';
                          setIsMacAddress(formatted);
                        }}
                        value={isMacAddress}
                        name="macAddress"
                        id="macAddress"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter Your Mac Address" required="" />
                    </div>
                  </div>
                  <CardElement
                    options={{
                      hidePostalCode: true,
                      style: {
                        base: {
                          fontSize: '20px'
                        },
                        invalid: {
                          color: 'red'
                        }
                      }
                    }}
                  />
                  <button type="submit"
                    // onClick={handleAdd}
                    className="text-white bg-blue-900 rounded-md w-full mt-4" disabled={isLoading}>
                    {isLoading ?
                      <i className='fas fa-spinner fa-spin text-2xl'></i>
                      : 'Pay'}
                  </button>
                </form>

              </div>
            </div>
          </div>
        </div>
        : ''}
    </>
  )
}
