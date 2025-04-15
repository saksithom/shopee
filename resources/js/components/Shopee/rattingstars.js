import React from 'react';
import { Star, StarBorder, StarHalf } from '@mui/icons-material';

const StarRating = ({ rating = 0, totalStars = 5 }) => {
    return (
        <span style={{ display: 'flex', alignItems: 'center' }}>
            {[...Array(totalStars)].map((_, index) => {
                const starValue = index + 1;
                if (rating >= starValue) {
                    return <Star key={index} style={{ color: 'gold', fontSize: '24px' }} />;
                } else if (rating >= starValue - 0.5) {
                    return <StarHalf key={index} style={{ color: 'gold', fontSize: '24px' }} />;
                } else {
                    return <StarBorder key={index} style={{ color: 'gold', fontSize: '24px' }} />;
                }
            })}
        </span>
    );
};

export default StarRating;
