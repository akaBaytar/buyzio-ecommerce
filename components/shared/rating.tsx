import { FaStarHalfAlt, FaStar, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, caption }: { value: number; caption?: string }) => {
  const Empty = () => <FaRegStar className='size-4' />;
  const Full = () => <FaStar className='size-4' />;
  const Half = () => <FaStarHalfAlt className='size-4' />;

  return (
    <div title={`${value.toString()}/5 rating`} className='flex gap-2.5'>
      <div className='flex gap-1'>
        {value >= 1 ? <Full /> : value >= 0.5 ? <Half /> : <Empty />}
        {value >= 2 ? <Full /> : value >= 1.5 ? <Half /> : <Empty />}
        {value >= 3 ? <Full /> : value >= 2.5 ? <Half /> : <Empty />}
        {value >= 4 ? <Full /> : value >= 3.5 ? <Half /> : <Empty />}
        {value >= 5 ? <Full /> : value >= 4.5 ? <Half /> : <Empty />}
      </div>

      {caption && <span className='text-sm'>{caption}</span>}
    </div>
  );
};
export default Rating;
