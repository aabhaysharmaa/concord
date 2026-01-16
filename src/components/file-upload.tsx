/* eslint-disable @typescript-eslint/no-explicit-any */


"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

// import "@uploadthing/react/styles.css"

interface FileUploadProps {
	onChange: (url: string) => void;
	value: string
	endpoint: "messageFile" | "serverImage"
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
	const fileType = value?.split(".").pop();
	console.log("FileType :", fileType)
	const removeImage = () => {
		onChange("")
	}

	if (value && fileType !== "pdf") {
		return (
			<div className="relative size-30">
				<Image src={value} fill alt="uploadImage" className="rounded-xl  object-cover" />
				<X onClick={removeImage} className="size-5 rounded bg-rose-500 -right-1 -top-2 absolute text-white cursor-pointer" />
			</div>
		)
	}

	if (value && fileType === "pdf") {
		return (
			<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
				<FileIcon className="size-10 fill-indigo-200 stroke-indigo-400" />
				<a href={value} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">{value}</a>
				<button onClick={removeImage} type="button" className="size-5 rounded bg-rose-500 -right-2 -top-2 absolute text-white cursor-pointer"> </button>
			</div>
		)
	}
	return (
		<UploadDropzone
			appearance={{
				button({ ready, isUploading }) {
					return {
						fontSize: "1rem",
						color: "black",
						...(ready && { color: "white", padding: "20px", background: "#A294F9", marginBottom: "20px", marginTop: "20px", fontWeight: "bold", cursor: "pointer" }),
						...(isUploading && { color: "#ffffff", padding: "20px", background: "#A294F9" }),
					};
				},
				container: {
					marginTop: "1rem",
				},
				allowedContent: {
					color: "#a1a1aa",
				},
				uploadIcon: {
					width: "60px"
				}
			}}


			className="border-2  border-zinc-300 flex cursor-pointer flex-col border-dashed dark:border-neutral-500 text-[#A294F9] w-70 h-60" endpoint={endpoint} onClientUploadComplete={(res: any) => {
				console.log("RES", res?.[0].url)
				onChange(res?.[0].url)
			}}
			onUploadError={(error: Error) => {
				alert(`ERROR! ${error.message}`);
			}}
		/>


	)
}
