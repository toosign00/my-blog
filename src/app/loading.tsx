const Loading = () => {
  return (
    <div className='flex min-h-[calc(100dvh-4.21875rem)] tablet:min-h-[calc(100dvh-6.25rem)] items-center justify-center'>
      <div className='flex gap-1.5'>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className='h-1.5 w-1.5 rounded-full'
            style={{
              backgroundColor: 'var(--color-gray-light)',
              animation: `loading-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;
