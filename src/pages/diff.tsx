import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { LinkIcon } from '@heroicons/react/20/solid';
import type { Chain } from '@/../script/index';
import { ChainDiffSelector } from '@/components/ChainDiffSelector';
import { DiffDeployedContracts } from '@/components/diff/DiffDeployedContracts';
import { DiffEVMStackAddresses } from '@/components/diff/DiffEVMStackAddresses';
import { DiffJSON } from '@/components/diff/DiffJSON';
import { DiffMetadata } from '@/components/diff/DiffMetadata';
import { DiffOpcodes } from '@/components/diff/DiffOpcodes';
import { DiffPrecompiles } from '@/components/diff/DiffPrecompiles';
import { Copyable } from '@/components/ui/Copyable';
import { Toggle } from '@/components/ui/Toggle';
import { chainLogoUrl } from '@/lib/utils';
import Image from 'next/image';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';

interface Props<T> {
	base: T;
	target: T;
	onlyShowDiff: boolean;
}

interface Section {
	title: string;
	infoText?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: React.ComponentType<Props<any>>;
}

const SECTION_MAP: Record<string, Section> = {
	metadata: { title: 'Metadata', component: DiffMetadata },
	opcodes: {
		title: 'Opcodes',
		component: DiffOpcodes,
		infoText: 'Whether or not standard opcodes are supported.',
	},
	deployedContracts: {
		title: 'Deployed Contracts',
		component: DiffDeployedContracts,
		infoText: 'Whether common utility contracts used by developers and users exist.',
	},
	precompiles: {
		title: 'Precompiles',
		component: DiffPrecompiles,
		infoText: 'Whether or not standard precompiles are supported.',
	},
	evmStackAddresses: {
		title: 'EVM Stack Addresses',
		component: DiffEVMStackAddresses,
		infoText:
			'Existence of "stack-specific" accounts on a chain, to determine what kind of chain it is. If an account exists on both chains but shows up in the diff, it indicates the code hash is different. This does not necessarily mean the contract is different.',
	},
	// signatureTypes: { title: 'Transaction and Signature Types', component: DiffSignatureTypes },
	// accountTypes: { title: 'Account Types', component: DiffAccountTypes },
	// eips: { title: 'Execution EIPs', component: DiffEIPs },
	// executionNodes: { title: 'Execution Nodes', component: DiffNodes },
	// consensusNodes: { title: 'Consensus Nodes', component: DiffNodes, hide: true }, // Hidden to scope UI to execution data
};

const Diff = () => {
	// -------- Parse query parameters --------
	const router = useRouter();
	const {
		base,
		target,
		onlyShowDiff: onlyShowDiffParam,
		showPrettyDiff: showPrettyDiffParam,
	} = router.query;

	const [loading, setLoading] = useState(true);
	const [baseChain, setBaseChain] = useState(null);
	const [targetChain, setTargetChain] = useState(null);
	const [onlyShowDiff, setOnlyShowDiff] = useState(true);
	const [showPrettyDiff, setShowPrettyDiff] = useState(true);

	useEffect(() => {
		if (!base || !target) return;
		if (onlyShowDiffParam !== undefined) setOnlyShowDiff(onlyShowDiffParam === 'true');
		if (showPrettyDiffParam !== undefined) setShowPrettyDiff(showPrettyDiffParam === 'true');

		const fetchData = async () => {
			try {
				const urls = [
					`https://raw.githubusercontent.com/mds1/evm-diff/refactor/automated/script/data/chain/${base}.json`,
					`https://raw.githubusercontent.com/mds1/evm-diff/refactor/automated/script/data/chain/${target}.json`,
				];

				const chainData = await Promise.all(
					urls.map(async (url) => {
						const response = await fetch(url);
						return response.json();
					}),
				);

				setBaseChain(chainData[0]);
				setTargetChain(chainData[1]);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching data:', error);
				setLoading(false);
			}
		};

		fetchData();
	}, [base, target, onlyShowDiffParam, showPrettyDiffParam]);

	const ErrorDiv = () => (
		<main className="text-center">
			<h1 className="text-primary text-3xl font-bold tracking-tight sm:text-5xl">Oops!</h1>
			<p className="text-secondary mt-6 text-base leading-7">
				Invalid chain(s) provided, please try again below.
			</p>
			<div className="mx-auto mt-10 flex max-w-md gap-x-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
				<ChainDiffSelector />
			</div>
		</main>
	);

	const LoadingDiv = () => (
		<main className="text-center">
			<div className="inline-block h-8 w-8 animate-[spin_1.5s_linear_infinite] rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_2s_linear_infinite]" />
			<h1 className="text-secondary text-md tracking-wide mt-4">Fetching Data...</h1>
		</main>
	);

	// -------- Show diff --------
	const SectionComponent = ({
		section,
		base,
		target,
		onlyShowDiff,
	}: {
		section: string;
		base: Chain[keyof Chain];
		target: Chain[keyof Chain];
		onlyShowDiff: boolean;
	}) => {
		// if (!SECTION_MAP[section]) return <></>;
		const Component = SECTION_MAP[section].component;
		return <Component {...{ base, target, onlyShowDiff }} />;
	};

	// We take `baseChain` and `targetChain` as arguments to ensure that they are not `undefined`
	// and remove the need for `?` and `!` operators.
	const DiffDiv = ({ baseChain, targetChain }: { baseChain: Chain; targetChain: Chain }) => {
		const sections = Object.keys(SECTION_MAP);
		const onBack = (e: React.MouseEvent) => {
			e.preventDefault();
			router.push({ pathname: '/' });
		};

		return (
			<>
				<main>
					<button
						onClick={onBack}
						className="mb-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
					>
						<ArrowLeftIcon width="1.1rem" className="mr-1 inline-block" /> Back
					</button>
					<div className="mb-8 border border-zinc-200 rounded-md p-4 bg-zinc-100 shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
						<div className="flex space-x-8">
							<Toggle
								enabled={onlyShowDiff}
								setEnabled={setOnlyShowDiff}
								enabledText="Show Diff"
								disabledText="Show All"
								queryParamName="onlyShowDiff"
							/>
							<Toggle
								enabled={showPrettyDiff}
								setEnabled={setShowPrettyDiff}
								enabledText="Formatted"
								disabledText="JSON Diff"
								queryParamName="showPrettyDiff"
							/>
						</div>
					</div>

					{/* Show chain names at top */}
					<div className="grid grid-cols-12 border-zinc-500/10 dark:border-zinc-500/20 sticky top-0 bg-zinc-50 dark:bg-zinc-900 z-10 p-4">
						<div className="col-span-2 text-left" />
						<div className="col-span-5 flex items-center space-x-2 text-lg font-bold">
							<Image
								src={chainLogoUrl({
									name: baseChain.metadata.name,
									chainId: baseChain.metadata.chainId,
								})}
								alt=""
								className="h-6 w-6 flex-shrink-0 rounded-full"
								width={24}
								height={24}
							/>
							<div>{baseChain.metadata.name}</div>
						</div>
						<div className="col-span-5 flex items-center space-x-2 text-lg font-bold">
							<Image
								src={chainLogoUrl({
									name: targetChain.metadata.name,
									chainId: targetChain.metadata.chainId,
								})}
								alt=""
								className="h-6 w-6 flex-shrink-0 rounded-full"
								width={24}
								height={24}
							/>
							<div>{targetChain.metadata.name}</div>
						</div>
					</div>

					{!showPrettyDiff && (
						<DiffJSON
							base={JSON.stringify(baseChain, null, 2)}
							target={JSON.stringify(targetChain, null, 2)}
							onlyShowDiff={onlyShowDiff}
						/>
					)}

					{/* Show content */}
					{showPrettyDiff &&
						sections.map((section) => {
							const base = baseChain[section as keyof Chain];
							const target = targetChain[section as keyof Chain];
							return (
								<div key={section} id={section} className="mt-8">
									<div className="sticky top-12 bg-zinc-100 dark:bg-zinc-800 z-10 rounded-t-lg border border-b-0 border-zinc-200 dark:border-zinc-700">
										<div className="px-4 py-2">
											<Copyable
												content={SECTION_MAP[section].title || section}
												textToCopy={`${location.href.replace(location.hash, '')}#${section}`}
												Icon={LinkIcon}
												className="group relative flex w-max items-center text-xl font-bold leading-8 tracking-wide text-zinc-900 dark:text-zinc-100"
											/>
											<div className="text-secondary text-sm">{SECTION_MAP[section].infoText}</div>
										</div>
									</div>
									<div className="rounded-b-lg border border-t-1 border-zinc-200 dark:border-zinc-700 px-4">
										<SectionComponent {...{ section, base, target, onlyShowDiff }} />
									</div>
								</div>
							);
						})}
				</main>
			</>
		);
	};

	return (
		<div>
			{loading && <LoadingDiv />}
			{!loading && (!baseChain || !targetChain) && <ErrorDiv />}
			{!loading && baseChain && targetChain && (
				<DiffDiv baseChain={baseChain} targetChain={targetChain} />
			)}
		</div>
	);
};

export default Diff;
