import type { ReactNode } from "react";

import "./_ui/styles/globals.css";

interface Props {
    children: ReactNode;
}

const RootLayout = ({ children }: Readonly<Props>) =>
    <html lang="en">
        <body>
            {children}
        </body>
    </html>;

export default RootLayout;
