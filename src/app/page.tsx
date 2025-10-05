import Image from 'next/image';
import { HeroForm } from '@/components/home/hero-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');

  return (
    <div className="relative">
      <section className="relative w-full h-[calc(100vh-65px)] flex items-center justify-center">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground flex flex-col lg:flex-row items-center justify-center gap-12">
          <div className="max-w-2xl text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
              Unlock Your Mortgage Freedom Sooner!
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-200">
              Discover the revolutionary method that puts you back in control of
              your home loan.
            </p>
          </div>
          <HeroForm />
        </div>
      </section>
    </div>
  );
}
