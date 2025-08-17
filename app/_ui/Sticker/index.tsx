"use client";

import { useMemo } from "react";
import QrCode from "../QrCode";

// FIXME... just have a 2d array thing
interface QrCodeIface {
  getModuleCount(): number;
  isDark(row: number, col: number): boolean;
}

// FIXME awfully ugly
const textWrap = (text: string, cols: number | undefined = 21) => {
    // FIXME columns is a bad way of doing text wrapping
    text = text.trim();
    const lines = [];
    while (text.length > 0) {
        lines.push(text.substring(0, cols).trim());
        text = text.substring(cols).trim();
    }
    return lines.join('\n');
};

interface Props {
    image?: string;
    title: string;
    author: string;
    href: string;
    qr: QrCodeIface;
}

const Sticker = ({ qr, title, author, href, image }: Props) => {
    const titleLines = useMemo(() => textWrap(title), [title]).split('\n');
    const authorLines = useMemo(() => textWrap(author), [author]).split('\n');
    const hrefLines = useMemo(() => textWrap(href, 29), [href]).split('\n');

    const lineHeight = 23;
    const offset = lineHeight * (titleLines.length + authorLines.length + hrefLines.length + 0.5);
    const height = 211 + offset;

    const count = qr.getModuleCount();
    return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"
        width="211px" height={`${height}px`} viewBox={`0 0 211 ${height}`}>
        <symbol id="qrcode" viewBox={`0 0 ${count} ${count}`}>
           <QrCode qr={qr} positionMarker={image} />
        </symbol>
        <text x={0} y={0}>
        {
            titleLines.map((line, ix) =>
                <tspan fontStyle="italic" key={ix} x={0} dy={lineHeight}>{line}</tspan>
                )
        }
        {
            authorLines.map((line, ix) =>
                <tspan key={ix} x={0} dy={lineHeight}>{line}</tspan>
                )
        }
        {
            hrefLines.map((line, ix) =>
                <tspan fontFamily="monospace" key={ix} x={0} dy={lineHeight}>{line}</tspan>
                )
        }
        </text>
        <use href="#qrcode" x={0} y={offset} width={211} height={211} />
    </svg>;
};

export default Sticker;
