"use client";

import QrCode from "./QrCode";
import { useMemo } from "react";

interface Props {
    image?: string;
    label: string;
    value: string;
}

const Sticker = ({ image, label, value }: Props) => {
    return <main>
       <header>
          { image && <img alt="" src={image} width={40} height={40} /> }
           <hgroup>
               <h1>{label}</h1>
               <p>{value}</p>
           </hgroup>
        </header>
        <QrCode value={value} />
        </main>;
};

export default Sticker;
