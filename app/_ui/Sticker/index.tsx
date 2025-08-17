"use client";

import type { Ref } from "react";
import { useImperativeHandle, useMemo, useRef } from "react";

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

// FIXME awfully ugly
const split = (text: string, cols: number | undefined = 21) => {
    // FIXME columns is a bad way of doing text wrapping
    text = text.trim();
    const lines = [];
    while (text.length > 0) {
        lines.push(text.substring(0, cols).trim());
        text = text.substring(cols).trim();
    }
    return lines;
};

interface QrProps {
    image?: string;
    title: string;
    author: string;
    href: string;
    qr: QrCodeIface;
}

const QrCode = ({ qr, title, author, href, image }: QrProps) => {
    const titleLines = useMemo(() => split(title), [title]);
    const authorLines = useMemo(() => split(author), [author]);
    const hrefLines = useMemo(() => split(href), [href]);

    const lineHeight = 23;
    const offset = lineHeight * (titleLines.length + authorLines.length + hrefLines.length + 0.5);
    const height = 211 + offset;

    const count = qr.getModuleCount();
    return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"
        width="211px" height={`${height}px`} viewBox={`0 0 211 ${height}`}>
        <symbol id="qrcode" viewBox={`0 0 ${count} ${count}`}>
           <g>
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
           </g>
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
                <tspan key={ix} x={0} dy={lineHeight}>{line}</tspan>
                )
        }
        </text>
        <use href="#qrcode" x={0} y={offset} width={211} height={211} />
    </svg>;
};

export interface StickerHandle {
    svg(): string;
}

interface Props {
    ref?: Ref<StickerHandle>;
    image: string;
    title: string;
    author: string;
    href: string;
    qr: QrCodeIface;
}

const Sticker = ({ ref: stickerRef, qr, title, author, href, image }: Props) => {
    const ref = useRef<HTMLDivElement>(null);

    useImperativeHandle(stickerRef, () => ({
        svg() {
            return (ref.current!.lastChild as HTMLElement).outerHTML;
        }
    }), []);

    return <div ref={ref}>
        <QrCode qr={qr} title={title} author={author} href={href} image={image} />
        </div>;
}

export default Sticker;
