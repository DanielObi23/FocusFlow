export default function ContactSupportPage() {
    return (
        <>
            <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
                    <div 
                        className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" 
                        style={{
                            clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
                        }}
                    ></div>
                </div>
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">Contact support</h2>
                    <p className="mt-2 text-lg text-gray-600">
                        We're here to help. Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                </div>
                <form 
                    action="#" 
                    method="POST" 
                    className="mx-auto mt-16 max-w-xl sm:mt-20"
                    aria-labelledby="contact-form-heading"
                >
                    <div id="contact-form-heading" className="sr-only">Contact Support Form</div>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-900">First name</label>
                            <div className="mt-2.5">
                                <input 
                                    type="text" 
                                    name="first-name" 
                                    id="first-name" 
                                    autoComplete="given-name" 
                                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                    aria-required="true"
                                    aria-describedby="first-name-description"
                                />
                                <div id="first-name-description" className="sr-only">Enter your first name</div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900">Last name</label>
                            <div className="mt-2.5">
                                <input 
                                    type="text" 
                                    name="last-name" 
                                    id="last-name" 
                                    autoComplete="family-name" 
                                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                    aria-required="true"
                                    aria-describedby="last-name-description"
                                />
                                <div id="last-name-description" className="sr-only">Enter your last name</div>
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">Email</label>
                            <div className="mt-2.5">
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    autoComplete="email" 
                                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                    aria-required="true"
                                    aria-describedby="email-description"
                                />
                                <div id="email-description" className="sr-only">Enter your email address for correspondence</div>
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900">Message</label>
                            <div className="mt-2.5">
                                <textarea 
                                    name="message" 
                                    id="message" 
                                    rows={4} 
                                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                    aria-required="true"
                                    aria-describedby="message-description"
                                    placeholder="Please describe how we can help you"
                                ></textarea>
                                <div id="message-description" className="sr-only">Provide details about your support request</div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10">
                        <button 
                            type="submit" 
                            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            aria-label="Submit support request"
                        >
                            Let's talk
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}