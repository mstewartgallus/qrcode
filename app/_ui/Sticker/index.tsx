"use client";

import qrCodeUri from "@/lib/qrCodeUri";
import Image from "next/image";
import { useMemo } from "react";
import noImage from "./no-image.svg";

interface Props {
    image?: string;
    title: string;
    author: string;
    href: string;
}

const Sticker = ({ image, title, author, href }: Props) => {
    const src = useMemo(() => qrCodeUri(href, 'L'), [href]);
    return <>
        <header style={{ marginBottom: '0.05in' }}>
           <div style={{float: 'right' }}>
              <Image src={image ?? noImage} width={40} height={40} alt="" />
           </div>
           <hgroup style={{ wordBreak: 'break-all' }}>
               <h1 style={{all: 'unset', display: 'block', fontStyle: 'italic'}}>{title}</h1>
               <p style={{all: 'unset', display: 'block'}}>{author}</p>
               <p style={{all: 'unset', display: 'block', clear: 'both'}}>{href}</p>
           </hgroup>
        </header>
        <img src={src} width={211} height={211} alt={href} />
        </>;
};

export default Sticker;
