import Link from "next/link"

export default function Home() {
  return (
    <div className="bg-black bg-home-img bg-cover bg-center">

      <main className="flex flex-col justify-center text-center max-w-5xl mx-auto h-dvh">

        <div className="flex flex-col gap-6 p-12 rounded-xl bg-black/90 w-4/5 sm:max-w-96 mx-auto text-white sm:text-2xl">
          <h1 className="text-3xl font-bold">张三&apos;s 电脑修理店</h1>
          <address>
            上海市中山北路62号<br />
          </address>
          <p className="text-sm">
            星期一 - 星期五: 9am to 5pm
          </p>
          <Link href="tel:5555555555" className="hover:underline">
            021-65555555
          </Link>
        </div>

      </main>

    </div>
  );
}
