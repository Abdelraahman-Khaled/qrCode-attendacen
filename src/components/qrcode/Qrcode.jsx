import React from "react";
import { useLocation } from "react-router-dom";

const Qrcode = () => {
    const location = useLocation()
    const data = location.state?.data
    return (
        <div className="flex justify-center items-center h-full flex-col gap-5 my-14">
            <h1 className="text-3xl font-bold">{data?.course}</h1>
            <img
                src={data.qrCode}
                alt="qrcode"
                height={500}
                width={500}
            />
        </div>
    );
};

export default Qrcode;
