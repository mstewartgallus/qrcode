"use client";

import type { ChangeEvent, MouseEvent, FormEvent } from "react";
import type { FrameHandle } from "../Frame";
import Frame from "../Frame";
import Sticker from "../Sticker";
import { useCallback, useId, useRef, useState } from "react";

import styles from "./Form.module.css";

const titlePlaceholder = "The Art of War";
const authorPlaceholder = "Sun Tzu";
const hrefPlaceholder = "https://www.gutenberg.org/ebooks/132";

const style = `
html,
body {
    display: block;
    padding: 0;
    margin: 0;
    font-family: system-ui, sans-serif;
}

* {
    box-sizing: border-box;
}
@page {
   size: 2.4in 3.4in;
   margin: 0.1in;
}
@media screen {
   main {
      overflow: hidden;
      width: 2.4in;
      height: 3.4in;
      padding: 0.1in;
   }
   body {
      background-color: grey;
   }
   main {
      background-color: Canvas;
   }
}
body {
   display: flex;
   justify-content: center;
   align-items: center;
}
header {
   margin-bottom: 0.05in;
}
h1, p {
   all: unset;
   display: block;
   word-break: break-all;
}
.title {
   font-style: italic;
}
.href {
   clear: both;
}
img {
   float: right;
   width: 0.47in;
   height: 0.47in;
}
`;

const chooseFile = async (accept: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    await new Promise<void>((res) => {
        input.onchange = () => {
            res();
        };
        input.click();
    });
    const files = input.files;
    if (!files) {
        return [];
    }
    return [...files];
};

const accept = `image/*`;

const Form = () => {
    const ref = useRef<FrameHandle>(null);

    const [title, setTitle] = useState<string | null>(null);
    const [author, setAuthor] = useState<string | null>(null);
    const [href, setHref] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
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

    const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        ref.current!.save('agitprop');
    }, []);

    const onClickPrint = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        ref.current!.print();
    }, []);

    const uploadAction = useCallback(async () => {
        const file = (await chooseFile(accept))[0];
        const name = file.name;

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
        setName(name);
    }, []);

    const stickerHeading = useId();
    // FIXME create a hidden iframe in the background to save and print
    return <form onSubmit={onSubmit}>
        <fieldset>
           <div>
              <label>Title</label>
              <input className={styles.input} required maxLength={25} type="text" name="title" placeholder={titlePlaceholder} value={title ?? ''} onChange={onChangeTitle} />
           </div>
           <div>
              <label>Author</label>
        <input className={styles.input} required maxLength={25} type="text" name="author" placeholder={authorPlaceholder} value={author ?? ''} onChange={onChangeAuthor} />
           </div>
           <div>
              <label>Url</label>
              <input className={styles.input} required maxLength={78} type="url" name="value" placeholder={hrefPlaceholder} value={href ?? ''} onChange={onChangeValue}  />
            </div>
            <div>
              <label>{name ? name : 'No Selection'}</label>
              <button onClick={uploadAction}>Select Image</button>
            </div>
        </fieldset>
        <fieldset>
           <div>
              <button value="save">Download</button>
           </div>
           <div>
              <button value="print" onClick={onClickPrint}>Print</button>
           </div>
        </fieldset>
        <output className={styles.output} aria-labelledby={stickerHeading}>
           <h2 id={stickerHeading}>Sticker Format 2.4&quot;</h2>
           <Frame ref={ref} width={240} height={346} head={<style>{style}</style>}>
               <Sticker image={image ?? undefined} title={title ?? titlePlaceholder} author={author ?? authorPlaceholder}
                href={href ?? hrefPlaceholder} />
            </Frame>
        </output>
   </form>
};

export default Form;
