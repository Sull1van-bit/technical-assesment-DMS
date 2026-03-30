import React from 'react';

const Form = () => {
  return (
    <div className="max-w-2xl w-full mx-auto relative overflow-hidden z-10 bg-white dark:bg-gray-800 p-8 md:p-10 rounded-xl shadow-lg before:w-32 before:h-32 before:absolute before:bg-purple-500 dark:before:bg-purple-600 before:rounded-full before:-z-10 before:blur-3xl after:w-40 after:h-40 after:absolute after:bg-sky-400 after:rounded-full after:-z-10 after:blur-2xl after:top-24 after:-right-12 transition-colors duration-300 border border-gray-100 dark:border-gray-700">
      <h2 className="text-3xl font-bold mb-8 text-sky-900 dark:text-white transition-colors">Submit a Ticket</h2>
      <form method="post" action="#">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors" htmlFor="name">Title</label>
          <input className="mt-1 p-2 w-full rounded-md border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors" type="text" id="name" name="name" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors" htmlFor="email">Submitted By</label>
          <input className="mt-1 p-2 w-full rounded-md border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors" name="email" id="email" type="email" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors" htmlFor="bio">Description</label>
          <textarea className="mt-1 p-2 w-full rounded-md border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors" rows={3} name="bio" id="bio" defaultValue={""} />
        </div>
        <div className="flex justify-end">
          <button className="bg-[linear-gradient(144deg,#af40ff,#5b42f3_50%,#00ddeb)] text-white px-4 py-2 font-bold rounded-md hover:opacity-80 transition-all" type="submit">
            Submit Ticket
          </button>
        </div>
      </form>
    </div>
  );
}

export default Form;
