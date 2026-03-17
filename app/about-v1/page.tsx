import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

// V1 — "Editorial" (Sean Halpin inspired)
// Large serif hero, split layout, photo surprise, fun fact chips, clean whitespace

export default function AboutV1() {
  return (
    <main className="bg-off-white">
      <Nav />

      {/* Hero — split layout */}
      <section className="pt-28 pb-0 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left: text */}
          <div className="pt-8">
            <p className="font-sans text-xs uppercase tracking-widest text-near-black/40 mb-6">About</p>
            <h1 className="font-serif text-5xl md:text-7xl text-near-black leading-[1.05] mb-6">
              Curious<br />about me?
            </h1>
            <p className="font-sans text-xl md:text-2xl text-near-black/60 leading-relaxed italic">
              I&apos;m a strategist, communicator, builder, and ice cream aficionado.
            </p>
          </div>

          {/* Right: photo */}
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos-mitch/Mitch-RaganHeadshot.jpg"
              alt="Mitch Leonard"
              className="w-full object-cover object-top rounded-sm"
              style={{ maxHeight: '520px' }}
            />
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-7 md:col-start-4 space-y-6">
            <p className="font-sans text-lg md:text-xl text-near-black/80 leading-relaxed">
              Since I was a kid, I&apos;ve loved telling stories. Stories from the playground, stories on-stage, and now, stories about brands who are making a difference in the world.
            </p>
            <p className="font-sans text-lg md:text-xl text-near-black/80 leading-relaxed">
              With over a decade of experience leading social media and integrated campaigns, I turn complexity into clarity and ideas into action. Currently, I lead AI-powered marketing transformation at the world&apos;s largest aerospace and defense company, driving GenAI innovation for content creation and cross-functional campaign management to increase digital performance and improve operational efficiency across global teams.
            </p>
            <p className="font-sans text-lg md:text-xl text-near-black/80 leading-relaxed">
              I thrive in fast-moving environments where strategy meets creativity. At the end of the day, I&apos;m looking to empower teams to move quickly, think boldly, and deliver work that makes a measurable impact.
            </p>
          </div>
        </div>
      </section>

      {/* Fun facts chips + second photo */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: fun facts */}
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-near-black/40 mb-8">When I&apos;m not working</p>
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                '🍦 145+ ice creams rated',
                '🏃 Running the Twin Cities',
                '🧩 Puzzle builder',
                '🧱 LEGO enthusiast',
                '✈️ Aerospace nerd',
                '📍 Minneapolis, MN',
              ].map((fact) => (
                <span
                  key={fact}
                  className="font-sans text-sm text-near-black border border-near-black/15 px-4 py-2 rounded-full"
                >
                  {fact}
                </span>
              ))}
            </div>
            <p className="font-sans text-lg text-near-black/80 leading-relaxed">
              When I&apos;m not heads deep in my work, you can find me adding ratings to my list of more than 145 ice cream delicacies, running around the Twin Cities, or putting together a puzzle or LEGO model.
            </p>
          </div>

          {/* Right: second photo */}
          <div className="grid grid-cols-2 gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos-mitch/Mitch-BallPit.JPG"
              alt="Mitch in a ball pit"
              className="w-full object-cover rounded-sm aspect-square"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos-mitch/Mitch-Helicopter.JPG"
              alt="Mitch in a helicopter"
              className="w-full object-cover rounded-sm aspect-square mt-8"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos-mitch/Mitch-Magnolia.jpg"
              alt="Mitch at Magnolia"
              className="w-full object-cover rounded-sm aspect-square"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos-mitch/Mitch.Leonard.jpeg"
              alt="Mitch Leonard"
              className="w-full object-cover rounded-sm aspect-square mt-8"
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
