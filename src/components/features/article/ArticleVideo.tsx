"use client";

import { useContentfulInspectorMode } from "@contentful/live-preview/react";
import { twMerge } from "tailwind-merge";

import type { RichVideo } from "@src/lib/__generated/sdk";

interface ArticleVideoProps {
	video: RichVideo;
}

export const ArticleVideo = ({ video }: ArticleVideoProps) => {
	const inspectorProps = useContentfulInspectorMode({ entryId: video.sys.id });

	return video.video ? (
		<figure>
			<div
				className="flex justify-center"
				{...inspectorProps({ fieldId: "video" })}
			>
				<video
					controls
					className={twMerge(
						"mt-0 mb-0 max-w-full h-auto rounded-2xl border border-gray300 shadow-lg",
					)}
					width={video.video.width || undefined}
					height={video.video.height || undefined}
				>
					{video.video.url && (
						<source
							src={video.video.url}
							{...(video.video.contentType && {
								type: video.video.contentType,
							})}
						/>
					)}
					<track kind="captions" srcLang="en" label="English captions" />
					Your browser does not support the video tag.
				</video>
			</div>
		</figure>
	) : null;
};
