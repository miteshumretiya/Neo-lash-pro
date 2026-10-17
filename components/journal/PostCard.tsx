import Image from "next/image";
import { TransitionLink } from "@/components/motion/Transition";
import { ArrowRight } from "@/components/ui/Icons";
import type { Post } from "@/data/types";
import { cn } from "@/lib/cn";

/** Journal teaser; `featured` lays the image and text side by side on desktop. */
export function PostCard({ post, featured = false, className }: { post: Post; featured?: boolean; className?: string }) {
  return (
    <TransitionLink
      href={`/journal/${post.slug}`}
      transitionTitle="Journal"
      data-cursor="Read"
      className={cn("group grid gap-6", featured && "lg:grid-cols-12 lg:items-center lg:gap-12", className)}
    >
      <span className={cn("relative block overflow-hidden rounded-frame", featured ? "aspect-[4/3] lg:col-span-7" : "aspect-[4/3]")}>
        <Image
          src={post.cover.src}
          alt={post.cover.alt}
          fill
          sizes={featured ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 768px) 100vw, 50vw"}
          className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-105"
        />
      </span>
      <span className={cn("block", featured && "lg:col-span-5")}>
        <span className="eyebrow block text-muted">
          {post.category} · {post.readingTime}
        </span>
        <span
          className={cn(
            "mt-4 block font-display leading-[1.02] tracking-[-0.01em]",
            featured ? "text-[clamp(2.2rem,4vw,3.8rem)]" : "text-[clamp(1.7rem,2.6vw,2.4rem)]",
          )}
        >
          {post.title}
        </span>
        <span className="mt-4 block max-w-lg leading-relaxed text-muted">{post.excerpt}</span>
        <span className="mt-6 inline-flex items-center gap-2 text-sm">
          <span className="link-u">Read article</span>
          <ArrowRight size={15} className="transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
        </span>
      </span>
    </TransitionLink>
  );
}
