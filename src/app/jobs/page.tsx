{jobs.map((job) => (

 "use client";

<article
    key={job.id}
    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
  >

    <h2 className="text-xl font-semibold">
      {job.title}
    </h2>


    <p className="mt-2 text-slate-600">
      {job.description}
    </p>


    <button
      type="button"
      onClick={() => {
        const jobUrl =
          `/jobs/${encodeURIComponent(job.id)}`;

        router.push(jobUrl);
      }}
      className="
        inline-flex
        items-center
        justify-center
        rounded-xl
        bg-primary
        px-5
        py-2.5
        text-sm
        font-semibold
        text-primary-foreground
        shadow-sm
        transition-all
        hover:opacity-90
        hover:shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-primary
        focus:ring-offset-2
      "
    >

      Ver oportunidad

      <span className="ml-2">
        →
      </span>

    </button>


  </article>

))}
