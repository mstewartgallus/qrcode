"use client";

import { useId } from "react";
import FilterMonochrome from "../FilterMonochrome";
import QrCode from "../QrCode";

// FIXME... just have a 2d array thing
interface QrCodeIface {
  getModuleCount(): number;
  isDark(row: number, col: number): boolean;
}

interface Props {
    image?: string;
    title: string;
    author: string;
    href: string;
    monochrome?: boolean;
    qr: QrCodeIface;
}

const A4 = ({ qr, title, author, href, image, monochrome = false }: Props) => {
    const monochromeId = useId();
    const qrcodeId = useId();
    const count = qr.getModuleCount();
    return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"
        width="8.27in" height="11.69in">
        <filter id={monochromeId}>
            <FilterMonochrome />
        </filter>
        <symbol id={qrcodeId} viewBox={`0 0 ${count + 2} ${count + 2}`}>
          <rect x={0} y={0} width={count + 2} height={count + 2} fill="white" />
          <g transform="translate(1, 1)">
            <QrCode qr={qr} positionMarker={image} />
          </g>
        </symbol>
        <g filter={monochrome ? `url(#${monochromeId})` : undefined}>
           <text y={110}>
              <tspan x={50} fontSize={60} fontStyle="italic">{title}</tspan>
              <tspan x={50} fontSize={30} dy={50}>{author}</tspan>
              <tspan x={50} fontSize={20} dy={30} fontFamily="monospace">{href}</tspan>
           </text>
           <g transform="translate(70, 280)">
             <image x={170} y={0} href={image} width={500} height={500} />
             <use href={`#${qrcodeId}`} x={0} y={370} width={420} height={420} />
           </g>
        </g>
    </svg>;
};

export default A4;
