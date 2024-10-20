## PicFable - Decentralized Photography Marketplace
[PicFable](https://eth-global-sf-2024.vercel.app/) is a decentralized marketplace that empowers photographers to register their images as intellectual property (IP), license them for use, and create derivative works using blockchain technology. Built during ETHGlobal San Francisco 2024, PicFable integrates multiple cutting-edge technologies, including Story Protocol, Walrus, Dynamic, and ENS.

# Key Features
Decentralized IP Registration: Photographers can easily register their work on the Story Protocol, ensuring transparent ownership.
Marketplace for Image Licensing: Users can license images and derivatives through our platform, with licensing terms stored on the blockchain.
Blob Storage: Images are stored as decentralized blobs using Walrus.
Dynamic Onboarding: Seamless onboarding experience powered by Dynamic.xyz.
ENS Integration: Personalized ENS URLs for photographers, enabling unique and privacy-centric links.

## Project Overview
# [Story Protocol](https://www.story.foundation/) Integration
We extensively utilized Story Protocol’s Registration and Licensing modules to:

Allow users to register their images as IP on the Story network.
Enable seamless licensing of images in the marketplace, ensuring photographers maintain control over their work.
While we didn't integrate the Disputes module, the heavy use of both Registration and Licensing ensures robust IP protection and ease of monetization for photographers.

# [Walrus](https://www.walrus.xyz/) Integration
PicFable uses Walrus to:

Store images as blobs, ensuring that image files are securely stored in a decentralized fashion.
This allows users to upload their images without reliance on centralized systems, further enhancing the decentralized ethos of the project.

# [Dynamic.xyz](https://www.dynamic.xyz/) Integration
For the onboarding layer, we implemented Dynamic.xyz to:

Offer a smooth and secure onboarding process for photographers and users, ensuring they can easily connect their wallets and interact with the platform without friction.
This integration ensures that users are quickly onboarded to the decentralized marketplace and can begin minting, licensing, and trading their images.

# [ENS](https://ens.domains/) Integration
We explored innovative use cases of ENS to:

Create personalized ENS URLs for photographers, allowing them to have unique and privacy-centric URLs for their galleries.
This feature also supports privacy protection by auto-rotating addresses linked to their ENS names, ensuring enhanced security.

## How We Used Each Technology
# [Story Protocol](https://www.story.foundation/)
Modules: Registration, Licensing
Purpose: Secure image registration as IP and facilitate licensing through a decentralized marketplace.
Usage: All images registered on the platform interact with Story Protocol to ensure transparent ownership, while licensing occurs directly through the Story network.
# [Walrus](https://www.walrus.xyz/)
Usage: We utilized Walrus for storing uploaded images as blobs. This decentralized storage ensures that images remain accessible and secure without relying on traditional cloud infrastructure.
# [Dynamic.xyz](https://www.dynamic.xyz/)
Usage: Onboarding layer for all users and photographers, enabling wallet-based login and streamlined access to PicFable's features.
# [ENS](https://ens.domains/)
Usage: We used ENS to provide custom URLs for photographers, allowing them to publish their collections under unique, recognizable names while preserving privacy.

## How to Run the Project
1. Clone the repository.
```bash
git clone https://github.com/your-repo/PicFable.git
cd PicFable
```
2. Install dependencies 
```bash 
npm install
``` 
3. Run the project locally 
``` bash 
npm start
```
4. Ensure you have a wallet setup and connect via Dynamic.xyz when prompted.
5. Upload your images, mint them as NFTs, register them on Story Protocol, and license them through the marketplace!


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



