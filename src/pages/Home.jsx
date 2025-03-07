import React from 'react'
import LectureForm from '../components/lectureForm/LectureForm'
import { Link, Navigate } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext';

const Home = () => {
    const { user } = useAuthContext();
    return (

        <>

            <div className='flex flex-row gap-3 my-3 h-full items-center justify-center'>
                <Link className='bg-[#28c254] text-2xl  py-3 px-6  text-white rounded font-bold' to="/attendance">
                    attendance
                </Link>
                <Link className='bg-[#28c254]  text-2xl py-3 px-6  text-white rounded font-bold' to="/create-lecture">
                    Create Lecture
                </Link>
                <Link className='bg-[#28c254]  text-2xl py-3 px-6  text-white rounded font-bold' to="/history">
                    Qr History
                </Link>
            </div>
        </>
    )
}

export default Home