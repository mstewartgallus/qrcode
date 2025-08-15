"use client";

import qrcode from "qrcode-generator";
import { useMemo, useRef } from "react";

interface Props {
    label: string;
    value: string;
}
const QrCode = ({ label, value }: Props) => {
    const svg = useMemo(() => {
        const qr = qrcode(4, 'H')
        qr.addData(value);
        qr.make();
        return qr.createSvgTag(17, 0);
    }, [value]);

    return <main>
        <header>
           <h1>{label}</h1>
           <p>{value}</p>
        </header>
        <div dangerouslySetInnerHTML={{__html: svg}} />
    </main>;
};

export default QrCode;
