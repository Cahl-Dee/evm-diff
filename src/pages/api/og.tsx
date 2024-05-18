import type { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';
import { chainNameFromId } from '@/lib/utils';
import { SITE_DESCRIPTION } from '@/lib/constants';

export const config = {
	runtime: 'edge',
};

type Chain = {
	chainId: number;
	name: string;
};

export default async function handler(request: NextRequest) {
	const getLogoImageData = async () => {
		return await fetch(new URL('public/logo-dark-tight.png', import.meta.url)).then((res) =>
			res.arrayBuffer(),
		);
	};
	const generateDefaultImage = async () => {
		const imageData = await getLogoImageData();
		return new ImageResponse(
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#f4f4f5',
				}}
			>
				<h2
					style={{
						fontSize: 100,
					}}
				>
					{/*
               Temporarily disable eslint: warnings around using `img` over the NextImage, and TS
               errors with `Type 'ArrayBuffer' is not assignable to type 'string'`, but this does
               works and is recommended in the NextJS docs: https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation/og-image-examples#using-a-local-image
             */}
					{/* eslint-disable */}
					{/* @ts-ignore */}
					<img width="400" src={imageData} />
					{/* eslint-enable */}
				</h2>
				<p
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 34,
					}}
				>
					<p>{SITE_DESCRIPTION}</p>
				</p>
			</div>,
			{
				width: 1200,
				height: 630,
			},
		);
	};

	const generateDiffImage = async (_baseChain: Chain, _targetChain: Chain) => {
		const imageData = await getLogoImageData();

		return new ImageResponse(
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#f4f4f5',
					paddingTop: '50px',
				}}
			>
				{/*
            Temporarily disable eslint: warnings around using `img` over the NextImage, and TS
            errors with `Type 'ArrayBuffer' is not assignable to type 'string'`, but this does
            works and is recommended in the NextJS docs: https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation/og-image-examples#using-a-local-image
          */}
				{/* eslint-disable */}
				{/* @ts-ignore */}
				<img width="400" src={imageData} />
				{/* eslint-enable */}
			</div>,
			{
				width: 1200,
				height: 630,
			},
		);
	};

	try {
		const { searchParams } = request.nextUrl;
		const base = searchParams.get('base'); // ?base=<base>
		const target = searchParams.get('target')?.slice(0, 100); // ?target=<target>
		if (!base || !target) return generateDefaultImage();

		const baseChainName = chainNameFromId(Number(base));
		if (baseChainName === undefined) return generateDefaultImage();

		const targetChainName = chainNameFromId(Number(target));
		if (targetChainName === undefined) return generateDefaultImage();

		return await generateDiffImage(
			{ chainId: Number(base), name: baseChainName },
			{ chainId: Number(target), name: targetChainName },
		);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		console.log(`OG image generation failed with error: ${e.message}`);
		return generateDefaultImage();
	}
}
