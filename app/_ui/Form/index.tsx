"use client";

import type { ChangeEvent } from "react";
import SvgDownload from "../SvgDownload";
import Sticker from "../Sticker";
import { useCallback, useEffect, useLayoutEffect, useMemo, useId, useRef, useState } from "react";
import svgUri from "@/lib/svgUri";
import noImage from "./no-image.svg";
import { cache } from "react";
import qrcode from "qrcode-generator";

import styles from "./Form.module.css";

const getDefaultPositionMarker = cache(async () => {
    // FIXME... read as data url
    const response = await fetch(noImage.src);
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const binaryString = String.fromCharCode(...bytes);
    return svgUri(binaryString);
});

const hrefPlaceholder = "https://www.gutenberg.org/ebooks/132";
const titlePlaceholder = "The Art of War";
const authorPlaceholder = "Sun Tzu";

const usePositionMarker = () => {
    const [marker, setMarker] = useState<string | null>(null);

    useEffect(() => {
        if (marker) {
            return;
        }
        (async () => {
            const marker = await getDefaultPositionMarker();
            setMarker(marker);
        })();
    }, [marker]);
    return marker;
};

interface OutputProps {
    title: string;
    author: string;
    href: string;
    image?: string;
}

const Output = ({ title, author, href, image }: OutputProps) => {
    const url = useMemo(() => {
        // FIXME.. validate URL
        const url = URL.canParse(href) ? new URL(href) : new URL(hrefPlaceholder);
        return url.hostname + url.pathname;
    }, [href]);

    const qr = useMemo(() => {
        const qr = qrcode(0, 'L')
        qr.addData(url);
        qr.make();
        return qr;
    }, [url]);

    const stickerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | null>(null);
    useLayoutEffect(() => {
        // FIXME... this is ick
        const height = stickerRef.current!.offsetHeight / 96;
        setHeight(height);
    }, [url, title, author, href]);

    const stickerHeading = useId();

    return <>
        <section className={styles.output} aria-labelledby={stickerHeading}>
           <h2 id={stickerHeading}>Sticker Format 2.4&quot;×{(height ?? 3.19).toFixed(2)}&quot;</h2>
               <div className={styles.sticker} ref={stickerRef}>
                   <SvgDownload download="sticker.svg">
                       <Sticker qr={qr} image={image}
                             title={title}
                             author={author}
                             href={url} />
                   </SvgDownload>
              </div>
        </section>
        </>;
};

const Form = () => {
    const [title, setTitle] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [href, setHref] = useState<string>('');
    const [image, setImage] = useState<string | null>(null);

    const onChangeTitle = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setTitle(event.target.value);
    }, []);
    const onChangeAuthor = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setAuthor(event.target.value);
    }, []);
    const onChangeValue = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setHref(event.target.value);
    }, []);

    const fileRef = useRef<HTMLInputElement>(null);

    const onChangeFile = useCallback(async () => {
        const file = fileRef.current!.files![0];

        const data = await new Promise<string>(res => {
            const reader = new FileReader();
            reader.addEventListener(
                'load',
                () => {
                    // convert image file to base64 string
                    res(reader.result as string);
                },
                false,
            );
            reader.readAsDataURL(file);
        });
        setImage(data);
    }, []);

    const noAction = useCallback(async () => {
        // FIXME... this is ugly
    }, []);

    const defaultMarker = usePositionMarker();

    return <form action={noAction}>
        <fieldset className={styles.inputs}>
           <label>Title</label>
           <input className={styles.input} required type="text" maxLength={80} name="title" placeholder={titlePlaceholder} value={title ?? ''} onChange={onChangeTitle} />

           <label>Author</label>
           <input className={styles.input} required type="text" maxLength={80} name="author" placeholder={authorPlaceholder} value={author ?? ''} onChange={onChangeAuthor} />

           <label>Url</label>
           <input className={styles.input} required maxLength={160} type="url" name="value" placeholder={hrefPlaceholder} value={href ?? ''} onChange={onChangeValue}  />

           <label>Position Marker</label>
           <input accept="image/*" ref={fileRef} required type="file" onChange={onChangeFile} />
        </fieldset>
        <Output
           title={title !== '' ? title : titlePlaceholder}
           author={author !== '' ? author : authorPlaceholder}
           href={href !== '' ? href : hrefPlaceholder}
           image={image ?? defaultMarker ?? undefined}
        />
   </form>
};

export default Form;
