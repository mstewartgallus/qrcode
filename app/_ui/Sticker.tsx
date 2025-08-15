"use client";

import QrCode from "./QrCode";

interface Props {
    image?: string;
    title: string;
    author: string;
    href: string;
}

const Sticker = ({ image, title, author, href }: Props) => {
    return <main>
       <header>
          { image && <img alt="" src={image} width={40} height={40} /> }
           <hgroup>
               <h1 className="title">{title}</h1>
               <p className="author">{author}</p>
               <p className="href">{href}</p>
           </hgroup>
        </header>
        <QrCode value={href} />
        </main>;
};

export default Sticker;
