export const Backdrop = (props: React.ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm'
      {...props}
    />
  )
}
