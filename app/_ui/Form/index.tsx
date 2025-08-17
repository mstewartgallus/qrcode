"use client";

import type { ChangeEvent } from "react";
import type { StickerHandle } from "../Sticker";
import Sticker from "../Sticker";
import { useCallback, useEffect, useLayoutEffect, useMemo, useId, useRef, useState } from "react";
import svgUri from "@/lib/svgUri";
import noImage from "./no-image.svg";
import { cache } from "react";
import qrcode from "qrcode-generator";

import styles from "./Form.module.css";

const getDefaultPositionMarker = cache(async () => {
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

const download = (blob: Blob, download?: string) => {
    const href = URL.createObjectURL(blob);
    try {
        const anchor = document.createElement('a');
        anchor.href = href;
        if (download) {
            anchor.download = download;
        }
        anchor.click();
    } finally {
        URL.revokeObjectURL(href);
    }
};

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

const Form = () => {
    const [title, setTitle] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [href, setHref] = useState<string>('');
    const [image, setImage] = useState<string | null>(null);

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

    // FIXME... track height for downloading/printing
    const stickerHandleRef = useRef<StickerHandle>(null);


    const stickerRef = useRef<HTMLElement>(null);
    const [height, setHeight] = useState<number | null>(null);
    useLayoutEffect(() => {
        // FIXME... this is ick
        const height = stickerRef.current!.offsetHeight / 96;
        setHeight(height);
    }, [url, title, author, href]);

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

    const downloadAction = useCallback(async () => {
        download(new Blob([stickerHandleRef.current!.svg()]), 'sticker.svg');
    }, []);

    const stickerHeading = useId();

    const defaultMarker = usePositionMarker();

    return <form action={downloadAction}>
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
        <section className={styles.output} aria-labelledby={stickerHeading}>
           <h2 id={stickerHeading}>Sticker Format 2.4&quot;×{(height ?? 3.19).toFixed(2)}&quot;</h2>
           <fieldset className={styles.buttons}>
              <div>
                 <button value="download">Download sticker.svg</button>
              </div>
           </fieldset>
               <section className={styles.sticker} ref={stickerRef}>
                   <Sticker ref={stickerHandleRef} qr={qr} image={image ?? defaultMarker}
                       title={title === '' ? titlePlaceholder : title}
                       author={author === '' ? authorPlaceholder : author}
                       href={url} />
              </section>
        </section>
   </form>
};

export default Form;
