export default function Contact() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1>Contact us</h1>
        <form>
          <label htmlFor='name'>Your name</label>
          <input id='name' type='text' />
          <label htmlFor='message'>Message</label>
          <textarea id='message'/>
        </form>
      </main>
    </div>
  );
}
