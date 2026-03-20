export const ResponseIndexBadge = ({ index }: { index: number }) => (
  <div className="mb-1.5 flex items-center gap-2 after:h-px after:w-full after:bg-slate-200 after:content-['']">
    <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 !font-mono text-[0.65rem] text-slate-400'>
      {index + 1}
    </span>
  </div>
)
