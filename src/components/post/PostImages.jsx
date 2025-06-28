import React from 'react';

export default function PostImages({ image }) {
    if (!image) return null;

    const images = Array.isArray(image) ? image : [image];
    const hasMultipleImages = images.length > 1;

    return (
        <div className="relative">
            {hasMultipleImages ? (
                <div className="grid grid-cols-2 gap-1">
                    {images.slice(0, 4).map((img, index) => (
                        <div key={index} className="relative aspect-square">
                            <img
                                src={img}
                                alt={`post image ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <img
                    src={images[0]}
                    alt="post"
                    className="w-full h-64 object-cover"
                />
            )}
        </div>
    );
}