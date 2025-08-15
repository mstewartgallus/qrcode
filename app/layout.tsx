import type { ReactNode } from "react";

import "./_ui/styles/globals.css";

interface Props {
    children: ReactNode;
}

const RootLayout = ({ children }: Readonly<Props>) =>
    <html lang="en">
        <body>
            <main>
               {children}
            </main>
            <footer>
                <dl>
                    <dt>Key Dependencies:</dt>
                    <dd>
                       <a href="https://www.npmjs.com/package/qrcode-generator">
                          QR Code Generator
                       </a>
                    </dd>
                </dl>
            </footer>
        </body>
    </html>;

export default RootLayout;
