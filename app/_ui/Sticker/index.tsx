"use client";

import noImage from "./no-image.svg";

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


interface QrCodeProps {
    qr: QrCodeIface;
    width: number;
    image: string;
}

const QrCode = ({ qr, width, image }: QrCodeProps) => {
    const count = qr.getModuleCount();

    return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"
    width={`${width}px`} height={`${width}px`} viewBox={`0 0 ${count} ${count}`} >
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
    </svg>;
};

interface Props {
    image?: string;
    title: string;
    author: string;
    href: string;
    qr: QrCodeIface;
}

const Sticker = ({ image = noImage.src, title, author, href, qr }: Props) => {
    return <>
        <header style={{ paddingBottom: '0.05in' }}>
           <hgroup style={{ wordBreak: 'break-all' }}>
               <h3 style={{all: 'unset', display: 'inline', fontStyle: 'italic'}}>{title}</h3>
               <p style={{all: 'unset', display: 'inline'}}>&nbsp;{author}</p>
               <p style={{all: 'unset', display: 'block'}}>{href}</p>
           </hgroup>
        </header>
        <QrCode qr={qr} width={211} image={image} />
        </>;
};

export default Sticker;
