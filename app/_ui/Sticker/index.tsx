"use client";

import noImage from "./no-image.svg";
import { useRef, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import svgUri  from "@/lib/svgUri";

// FIXME... just have a 2d array thing
interface QrCodeIface {
  getModuleCount(): number;
  isDark(row: number, col: number): boolean;
}

const iter = <T,>(n: number, f: (ii: number) => T) => {
    const array = new Array(n);
    for (let ii = 0; ii < n; ii += 1) {
        array[ii] = f(ii);
    }
    return array as T[];
};

const isPositionMarker = (count: number, ii: number, jj: number) => {
    // Upper left
    if (ii >= 2 && ii <= 4
        && jj >= 2 && jj <= 4) {
        return true;
    }
    // top right
    if (ii >= count - 5 && ii <= count - 3
        && jj >= 2 && jj <= 4) {
        return true;
    }
    // bottom left
    if (ii >= 2 && ii <= 4
        && jj >= count - 5 && jj <= count - 3) {
        return true;
    }
    return false;
};

interface TSpansProps {
    text: string;
    split: number;
}

const TSpans = ({ text, split }: TSpansProps) => {
    const nodes = [];
    for (let ii = 0;; ii += 1) {
        nodes.push(<tspan key={ii} x={0} dy={2}>{text.substring(0, split)}</tspan>);
        if (text.length <= split) {
            break;
        }
        text = text.substring(split);
    }
    return <>{nodes}</>;
};

interface QrCodeProps {
    qr: QrCodeIface;
    width: number;
    title: string;
    author: string;
    href: string;
    image: string;
}


const QrCode = ({ qr, width, title, author, href, image }: QrCodeProps) => {
    const count = qr.getModuleCount();

    const offset = 2 * 4;
    const heightCounts = count + offset;
    const height = width * (heightCounts / count);
    return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"
    width={`${width}px`} height={`${height}px`} viewBox={`0 0 ${count} ${heightCounts}`} >
        <text fontSize={2}><TSpans text={title + ' - ' + author + ' ' + href} split={count - 2} /></text>
        <g transform={`translate(0,${offset})`}>
        {
            iter(count, ii =>
                iter(count, jj => {
                    if (isPositionMarker(count, ii, jj)) {
                        return;
                    }
                    if (!qr.isDark(ii, jj)) {
                        return;
                    }
                    return <rect key={`${ii}-${jj}`} x={ii} y={jj} width={1} height={1} />;
                })
            )
        }
        <filter id="monochrome">
            <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0.099 0.195 0.038 0 0
                        0.099 0.195 0.038 0 0
                        0.099 0.195 0.038 0 0
                        0     0     0     1 0" />
            <feComponentTransfer>
                <feFuncR type="discrete" tableValues="0 1" />
                <feFuncG type="discrete" tableValues="0 1" />
                <feFuncB type="discrete" tableValues="0 1" />
            </feComponentTransfer>
        </filter>
        <g filter="url(#monochrome)">
            <image x={2} y={2} href={image} width={3} height={3} />
            <image x={count - 5} y={2} href={image} width={3} height={3} />
            <image x={2} y={count - 5} href={image} width={3} height={3} />
        </g>
        </g>
    </svg>;
};

interface Props {
    image?: string;
    title: string;
    author: string;
    href: string;
    qr: QrCodeIface;
}

const Sticker = ({ image = noImage.src, title, author, href, qr }: Props) =>
    <QrCode qr={qr} width={211} image={image} title={title} author={author} href={href} />;

export default Sticker;
