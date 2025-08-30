import type { Metadata } from "next";
import Form from "./_ui/Form";

const IndexPage = async () => {
    return <>
        <h1>QRCode Generator</h1>
        <Form />
      </>;
};

export default IndexPage;

export const metadata: Metadata = {
  title: "QRCode Generator"
};
