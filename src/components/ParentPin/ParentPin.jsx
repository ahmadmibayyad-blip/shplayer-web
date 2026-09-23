import React, { useEffect, useState } from 'react';
import styles from './ParentPin.module.css';
import { Lang } from '../../lang.jsx';

export default function ParentPin() {
    const [pin, setPin] = useState(''); // State for the new PIN
    const [id, setId] = useState('66fadc1e68f2aa11843053be'); // Set this to your device ID
    const selectedLanguage = localStorage.getItem("lang") || 'en';
    const langValue = Lang[selectedLanguage];
    const [isLoading, setIsLodaing] = useState(false);
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        const body = {
            pin: pin
        };

        try {
            setIsLodaing(true)
            const response = await fetch('https://shplayer.onrender.com/lock/addParentPin', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `shM0${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);

            setPin('');
            alert(data.message)
            // You can show a success message or handle redirection here
        } catch (error) {
            console.error('Error:', error); // Handle error response
            // You can show an error message to the user here
        } finally {
            setIsLodaing(false);
        }
    };

    return (
        <>
            <form className="max-w-lg w-full" onSubmit={handleSubmit}>
                <h1 className="text-[#3C3C3C] text-3xl font-bold mb-5">{langValue['parentPinTitle']}</h1>

                <p className='text-[#3C3C3C] font-medium'>{langValue['resetParentPIN']}</p>
                <div className="mb-5 mt-7">
                    <label htmlFor="new-pin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {langValue['newParentPin']}
                    </label>
                    <input
                        type="password"
                        id="new-pin"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)} // Update state on change
                        className="bg-[#F5F5F5] border-0 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        required
                        maxLength={17}
                    />
                </div>
                <b className="text-[13px] block text-[#7D7E81]">
                    <span className="text-red-600">{langValue['noteThree']}:</span>
                    {langValue['noteDescThree']}
                </b>
                <br />
                <center>
                    <button type="submit" className="text-white bg-blue-900 font-medium rounded-lg text-xm w-[205px]">

                        {isLoading ? langValue['Saving...'] : langValue['Save']}
                    </button>
                </center>
            </form>
        </>
    );
}
