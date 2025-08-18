"use client";

import { useCallback, useEffect, useState, useId } from "react";
import QrCode from "../QrCode";

// FIXME... just have a 2d array thing
interface QrCodeIface {
  getModuleCount(): number;
  isDark(row: number, col: number): boolean;
}

interface TipProps {
    lines: number;
    formatAction?: (lines: number) => Promise<void>;
}

const Tip = ({ formatAction, lines }: TipProps) => {
    useEffect(() => {
        formatAction?.(lines);
    }, [formatAction, lines]);
    return undefined;
};

interface LineProps {
    children: string;
    dy: number;
}
const Line = ({ children, dy }: LineProps) => {
    return <tspan x={0} dy={dy}>{children.trim()}</tspan>;
};

interface TextProps {
    children: string;
    cols?: number;
    dy: number;
    formatAction?: (lines: number) => Promise<void>;
}

// FIXME use SVGElements's getComputedTextLength to implement word
// wrapping instead of columns
const Text = ({ children, cols = 21, dy, formatAction }: TextProps) => {
    const text = children.trim();

    return [...(function *() {
        let slice = text;
        let lines = 0;
        while (slice.length > 0) {
            const line = slice.substring(0, cols);
            yield <Line key={lines} dy={dy}>{line}</Line>;
            slice = slice.substring(cols).trim();
            lines += 1;
        }

        yield <Tip key="tip" lines={lines} formatAction={formatAction} />;
    })()];
};

interface Props {
    image?: string;
    title: string;
    author: string;
    href: string;
    qr: QrCodeIface;
}

const Sticker = ({ qr, title, author, href, image }: Props) => {
    const [titleLines, setTitleLines] = useState(1);
    const [authorLines, setAuthorLines] = useState(1);
    const [hrefLines, setHrefLines] = useState(1);

    const lineHeight = 23;
    const offset = lineHeight * (titleLines + authorLines + hrefLines + 0.5);
    const height = 211 + offset;

    const qrcodeId = useId();

    const formatTitleAction = useCallback(async (lines: number) => {
        setTitleLines(lines);
    }, []);
    const formatAuthorAction = useCallback(async (lines: number) => {
        setAuthorLines(lines);
    }, []);
    const formatHrefAction = useCallback(async (lines: number) => {
        setHrefLines(lines);
    }, []);

    const count = qr.getModuleCount();
    return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"
        width="211px" height={`${height}px`} viewBox={`0 0 211 ${height}`}>
        <symbol id={qrcodeId} viewBox={`0 0 ${count} ${count}`}>
           <QrCode qr={qr} positionMarker={image} />
        </symbol>
        <g>
           <text x={0} y={0}>
              <tspan fontStyle="italic">
                 <Text dy={lineHeight} formatAction={formatTitleAction}>{title}</Text>
              </tspan>
              <tspan>
                 <Text dy={lineHeight} formatAction={formatAuthorAction}>{author}</Text>
              </tspan>
              <tspan fontFamily="monospace">
                 <Text dy={lineHeight} formatAction={formatHrefAction} cols={29}>{href}</Text>
              </tspan>
           </text>
           <use href={`#${qrcodeId}`} x={0} y={offset} width={211} height={211} />
        </g>
    </svg>;
};

export default Sticker;
