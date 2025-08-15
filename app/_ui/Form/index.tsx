"use client";

import type { ChangeEvent, MouseEvent, FormEvent } from "react";
import type { FrameHandle } from "../Frame";
import Frame from "../Frame";
import Sticker from "../Sticker";
import { useCallback, useId, useRef, useState } from "react";

import styles from "./Form.module.css";

const labelPlaceholder = "Example Website";
const valuePlaceholder = "https://example.org";

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
   size: 2.4in 2.94in;
   margin: 0.1in;
}
@media screen {
   main {
      overflow: hidden;
      width: 2.4in;
      height: 2.94in;
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
}
img {
  float: right;
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

const accept = `image/png`;

const Form = () => {
    const ref = useRef<FrameHandle>(null);

    const [label, setLabel] = useState<string | null>(null);
    const [value, setValue] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);

    const onChangeLabel = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setLabel(event.target.value);
    }, []);
    const onChangeValue = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setValue(event.target.value);
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
    // FIXME... add image file picker..
    return <form onSubmit={onSubmit}>
        <fieldset>
           <div>
              <label>Label</label>
        <input className={styles.input} required maxLength={25} type="text" name="label" placeholder={labelPlaceholder} value={label ?? ''} onChange={onChangeLabel} />
           </div>
           <div>
              <label>Value</label>
              <input className={styles.input} required type="url" name="value" placeholder={valuePlaceholder} value={value ?? ''} onChange={onChangeValue}  />
            </div>
            <div>
              <label>{name ? name : 'No Selection'}</label>
              <button onClick={uploadAction}>Select Image</button>
            </div>
        </fieldset>
        <fieldset>
           <div>
              <button value="save">Save</button>
           </div>
           <div>
              <button value="print" onClick={onClickPrint}>Print</button>
           </div>
        </fieldset>
        <output className={styles.output} aria-labelledby={stickerHeading}>
           <h2 id={stickerHeading}>Sticker Format 2.4&quot;</h2>
           <Frame ref={ref} width={231} height={346} head={<style>{style}</style>}>
               <Sticker image={image ?? undefined} label={label ?? labelPlaceholder}
                value={value ?? valuePlaceholder} />
            </Frame>
        </output>
   </form>
};

export default Form;
