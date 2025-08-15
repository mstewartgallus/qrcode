"use client";

import qrcode from "qrcode-generator";
import { useMemo } from "react";

interface Props {
    value: string;
}
const QrCode = ({ value }: Props) => {
    const svg = useMemo(() => {
        const qr = qrcode(4, 'L')
        qr.addData(value);
        qr.make();
        // FIXME fix scaling
        return qr.createSvgTag(6.4, 0);
    }, [value]);

    return <div dangerouslySetInnerHTML={{__html: svg}} />;
};

export default QrCode;
